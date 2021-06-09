<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span>共{{ page.total }}条</span>
        </template>
        <!-- 右侧显示按钮 -->
        <template v-slot:after>
          <el-button
            type="success"
            size="small"
            @click="$router.push('/import')"
          >
            excel导入
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="exportData"
          >
            excel导出
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="!checkPermission('POINT-USER-ADD')"
            @click="showDialog = true"
          >
            新增员工
          </el-button>
        </template>
      </page-tools>

      <el-card>
        <!-- 表格区域 -->
        <el-table
          v-loading="loading"
          border
          :data="list"
        >
          <el-table-column
            type="index"
            label="序号"
            sortable=""
          />
          <el-table-column
            prop="username"
            label="姓名"
            sortable=""
          />
          <el-table-column
            label="头像"
            align="center"
            width="120px"
          >
            <template slot-scope="{ row }">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius:50% ; width:100px;height:100px;padding:10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="workNumber"
            label="工号"
            sortable=""
          />
          <el-table-column
            :formatter="formatEmployment"
            label="聘用形式"
            prop="formOfEmployment"
            sortable=""
          />
          <el-table-column
            label="部门"
            prop="departmentName"
            sortable=""
          />

          <el-table-column
            label="入职时间"
            sortable=""
          >
            <!-- 作用域插槽 -->
            <template slot-scope="obj">
              {{ obj.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>

          <el-table-column
            label="账户状态"
            prop="enableState"
            sortable=""
          >
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >
                查看
              </el-button>
              <el-button
                type="text"
                size="small"
              >
                转正
              </el-button>
              <el-button
                type="text"
                size="small"
              >
                调岗
              </el-button>
              <el-button
                type="text"
                size="small"
              >
                离职
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="editRole(row.id)"
              >
                角色
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="delEmployee(row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-row
          type="flex"
          justify="center"
          align="center"
          style="height: 60px"
        >
          <el-pagination
            layout="prev,pager,next"
            :total="page.total"
            :current-page="page.page"
            :page-size="page.size"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 弹出对话框 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 二维码 -->
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
    >
      <el-row
        type="flex"
        justify="center"
      >
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 分配角色组件 -->
    <assign-role
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
// 引入员工的枚举对象
import EmployeeEnum from "@/api/constant/employees";
import AddEmployee from "./components/add-employee.vue";
import { formatDate } from "@/filters";
import QrCode from "qrcode";
import AssignRole from "./components/assign-role.vue";
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      userId: null,
      showRoleDialog: false,
      showCodeDialog: false,
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false, // 显示遮罩层
      showDialog: false
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 找到1对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        await this.$confirm("确定删除该员工吗");
        await delEmployee(id);
        this.$message.success("删除员工成功");
        this.getEmployeeList();
      } catch (error) {
        console.log(error);
      }
    },
    // 导出excel数据
    exportData() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName"
      };
      import("@/vendor/Export2Excel").then(async excel => {
        // excel是引入文件的导出对象
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        });
        const data = this.formatJson(headers, rows);
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: "员工资料",
          multiHeader: multiHeader,
          merges: merges
        });
      });
      // import("@/vendor/Export2Excel").then(excel => {
      //   excel.export_json_to_excel({
      //     "header": ["姓名", "工资"],
      //     "data": [["张三",3000]],
      //     "filename": "员工工资"
      //   })
      // 要转化数据结构 与表头的顺序对应
      // 要求转出的标题为中文
      // })
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // 要判断字段
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            // 格式化日期
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = EmployeeEnum.hireType.find(
              obj => obj.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true;
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url); // 将地址转换为二维码链接
        });
      } else {
        this.$message.warning("该用户还未上传头像");
      }
    },
    async editRole(id) {
      this.userId = id;
      await this.$refs.assignRole.getUserDetailById(id);
      this.showRoleDialog = true;
    }
  }
};
</script>

<style></style>

<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 按钮 -->
            <el-row style="height: 60px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>

            <!-- 表格区域 -->
            <el-table border :data="list">
              <el-table-column
                label="序号"
                width="120"
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="角色"
                width="240"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="描述"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="center"
              style="height: 60px"
            >
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            ></el-alert>
            <el-form label-width="120px" style="margin-top: 30px">
              <el-form-item label="企业名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.companyAddress"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.companyPhone"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.mailbox"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 弹出对话框 编辑角色 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form
        label-width="120px"
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOk"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  UpdataRole,
  addRole,
} from "@/api/setting";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0,
      },
      formData: {
        // 公司信息
      },
      showDialog: false,
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  created() {
    this.getRoleList(); //获取角色列表
    this.getCompanyInfo();
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getRoleList();
    },
    async deleteRole(id) {
      try {
        await this.$confirm("确认删除该角色吗");
        await deleteRole(id);
        this.getRoleList();
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id); //数据回写
      this.showDialog = true;
    },
    btnCancel() {
      this.roleForm = {
        name: "",
        description: "",
      };
      this.showDialog = false;
      this.$refs.roleForm.resetFields();
    },
    async btnOk() {
      try {
        await this.$refs.roleForm.validate();
        //  只有校验通过的情况下 才会执行await之后的操作
        // this.roleForm有id就是编辑 没有就是新增
        if (this.roleForm.id) {
          await UpdataRole(this.roleForm);
        } else {
          // 新增业务
          await addRole(this.roleForm);
        }

        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>

<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="btnCancel"
  >
    <el-form
      ref="addEmployee"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="姓名"
        prop="username"
      >
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item
        label="手机"
        prop="mobile"
      >
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item
        label="入职时间"
        prop="timeOfEntry"
      >
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item
        label="聘用形式"
        prop="formOfEmployment"
      >
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="工号"
        prop="workNumber"
      >
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item
        label="部门"
        prop="departmentName"
      >
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="选择部门"
          @focus="getDeparments"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{ label: 'name' }"
          default-expand-all
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item
        label="转正时间"
        prop="correctionTime"
      >
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>

    <!-- footer插槽 -->
    <el-row
      slot:footer
      type="flex"
      justify="center"
    >
      <el-col :span="6">
        <el-button
          size="small"
          @click="btnCancel"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="btnOk"
        >
          确定
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { transListToTreeData } from "@/utils/index";
import EmployeeEnum from "@/api/constant/employees";
import { addEmployee } from "@/api/employees/";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 定义表单数据
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: ""
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位"
          }
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" }
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" }
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }]
      },
      treeData: [], //定义一个树形结构
      showTree: false,
      loading: false,
      EmployeeEnum
    };
  },
  methods: {
    async getDeparments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      // depts是一个数组 要转换成树形结构 才可以被el-tree显示
      this.treeData = transListToTreeData(depts, "");
      this.loading = false;
    },
    selectNode(node) {
      this.formData.departmentName = node.name;
      this.showTree = false;
    },
    btnCancel() {
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: ""
      };
      this.$refs.addEmployee.resetFields();
      //   this.$parent.showDialog = false;
      this.$emit("update:showDialog", false);
    },
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate();
        //   校验成功
        await addEmployee(this.formData);
        //   通知父组件 更新数据
        // this.$parent 父组件实例
        this.$parent.getEmployeeList && this.$parent.getEmployeeList(); //直接调用父组件的更新方法
        this.$parent.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style></style>

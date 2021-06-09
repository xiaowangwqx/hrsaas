<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单数据 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门编码"
        prop="code"
      >
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        prop="manager"
      >
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeesSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        prop="introduce"
      >
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row
      slot="footer"
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
          type="primary"
          size="small"
          @click="btnOk"
        >
          确定
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments
} from "@/api/departments";
import { getEmployeesSimple } from "@/api/employees";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      // 找同级部门下有没有和value相同的数据
      // 找到所有子部门
      let isRepeat = false;
      if (this.formData.id) {
        //有id就是编辑模式
        // 上级部门的id是下级部门的pid
        // 编辑的数据本来就有 要判断在同级部门下 名称不能和其他名称重复
        isRepeat = depts
          .filter(
            item =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some(item => item.name === value);
      } else {
        //没有id就是新增模式
        isRepeat = depts
          .filter(item => item.pid === this.treeNode.id)
          .some(item => item.name === value);
      }

      // 如果isRepeat 为true 表示找到了一样的名字
      isRepeat
        ? callback(new Error(`同级部门下已经存在${value}部门·`))
        : callback();
    };
    // 检查部门编码 在整个模块下不能重复
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts
          .filter(item => item.id !== this.treeNode.id)
          .some(item => item.code === value && value);
      } else {
        // 新增模式
        // 历史数据可能没有code 所以强制value不能为空
        isRepeat = depts.some(item => item.code === value && value);
      }

      isRepeat
        ? callback(new Error("组织架构下已经存在这个部门编码"))
        : callback();
    };
    return {
      // 定义个表单数据
      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: ""
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门名称长度为1-50个字符" },
          { trigger: "blur", validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码长度为1-50个字符",
            trigger: "blur"
          },
          { validator: checkCodeRepeat, trigger: "blur" }
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" }
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-300个字符",
            trigger: "blur"
          }
        ]
      },
      peoples: []
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    }
  },
  methods: {
    async getEmployeesSimple() {
      const result = await getEmployeesSimple();
      this.peoples = result;
    },
    // 获取部门详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
      // 父组件调用子组件的方法 想设置 node数据 直接调用方法 props传值是异步的
    },
    btnOk() {
      this.$refs.deptForm.validate(async isOk => {
        // 表单校验通过
        if (isOk) {
          if (this.formData.id) {
            await updateDepartments(this.formData);
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id });
          }
          // 告诉父组件 更新数据
          this.$emit("addDepts"); //触发自定义事件
          this.$emit("update:showDialog", false); //隐藏弹框
          // 关闭dialog时 会触发 el-dialog的close事件 不用单独重置数据
        }
      });
    },
    // 点击关闭弹出层
    btnCancel() {
      // 重置数据 因为resetFields只能重置表单上的数据 非表单上的数据不能重置
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: ""
      };
      this.$emit("update:showDialog", false); //隐藏弹框
      // 清除之前的校验
      this.$refs.deptForm.resetFields(); //只能重置定义在data中的数据
    }
  }
};
</script>

<style></style>

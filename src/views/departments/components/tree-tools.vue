<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row
        type="flex"
        justify="end"
      >
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-dept')"
              >
                添加子部门
              </el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  props: {
    // 定义传入的属性
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击编辑 删除 新增时触发
    operateDepts(type) {
      if (type === "add") {
        // 添加子部门
        this.$emit("addDepts", this.treeNode); //触发自定义事件 告诉父组件 显示弹层
      } else if (type === "edit") {
        // 编辑部门
        this.$emit("editDepts", this.treeNode);
      } else {
        // 删除部门
        //  调用接口 并且通知父组件更新数据
        this.$confirm("确定要删除该组织部门吗")
          .then(() => {
            return delDepartments(this.treeNode.id);
          })
          .then(() => {
            // 等到成功时 调用接口删除数据 后端数据变化 前端数据没有变化 重新获取
            this.$emit("delDepets"); //触发自定义事件
            this.$message.success("删除部门成功");
          });
      }
    }
  }
};
</script>

<style></style>

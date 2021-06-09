<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织结构的内容 -->

      <el-card class="tree-card">
        <!-- 树形结构 -->
        <!-- 头部 -->
        <tree-tools
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepts"
        />

        <el-tree
          :data="departs"
          :default-expand-all="true"
          :props="defaultProps"
        >
          <!-- 传入插槽内容  插槽内容会循环多次 有多少节点就循环多少次 -->
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepets="getDeparments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹框组件 -->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDeparments"
    />
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools";
import AddDept from "./components/add-dept";
import { getDepartments } from "@/api/departments";
import { transListToTreeData } from "@/utils/index";

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      defaultProps: {
        label: "name"
      },
      departs: [],
      company: { name: "", manager: "" },
      showDialog: false,
      node: null //记录当前点击的node节点
    };
  },
  created() {
    this.getDeparments();
  },
  methods: {
    async getDeparments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人", id: "" };
      this.departs = transListToTreeData(result.depts, "");
      console.log(result);
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    addDepts(node) {
      this.showDialog = true; //显示弹出层
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true;
      this.node = node;
      this.$refs.addDept.getDepartDetail(node.id);
    }
  }
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

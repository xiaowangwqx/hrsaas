<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission(1, 0)"
          >添加权限</el-button>
        </template>
      </page-tools>

      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- 添加按钮 只在访问权限层级显示 当type===1 时才显示 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
            >添加</el-button>
            <el-button
              type="text"
              @click="updatePermission(row.id)"
            >新增编辑</el-button>
            <el-button
              type="text"
              @click="delPermission(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增和编辑弹出层 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form
        ref="perForm"
        label-width="120px"
        :model="formData"
        :rules="rules"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  getPermissionDetail,
  updatePermission,
  delPermission,
  addPermission
} from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      showDialog: false,
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      // 将数据转化成带children属性的值
      this.list = transListToTreeData(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('确认删除该权限吗')
        .then(() => {
          return delPermission(id)
        })
        .then(() => {
          this.$message.success('删除成功')
          this.getPermissionList()
        })
    },
    addPermission(type, pid) {
      // 访问权type=1 按钮操作权 type=2
      // pid表示当前数据的父节点的标识
      // 记录当前添加类型和表示
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOk() {
      this.$refs.perForm
        .validate()
        .then(() => {
          // 校验成功
          if (this.formData.id) {
            // 认为是编辑
            return updatePermission(this.formData)
          }
          return updatePermission(this.formData)
        })
        .then(() => {
          this.$message.success('添加成功')
          this.showDialog = false
          this.getPermissionList()
        })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    async updatePermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style></style>

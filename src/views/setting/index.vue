<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 按钮 -->
            <el-row style="height: 60px">
              <el-button type="primary" icon="el-icon-plus" size="small"
                >新增角色</el-button
              >
            </el-row>

            <!-- 表格区域 -->
            <el-table border>
              <el-table-column label="序号" width="120"></el-table-column>
              <el-table-column label="角色" width="240"></el-table-column>
              <el-table-column label="描述"></el-table-column>
              <el-table-column label="操作">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑权限删除</el-button>
                <el-button size="small" type="danger">分配权限</el-button>
              </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="center"
              style="height: 60px"
            >
              <el-pagination layout="prev,pager,next"></el-pagination>
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
                <el-input disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
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
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>

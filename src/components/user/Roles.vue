<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>User Manage</el-breadcrumb-item>
      <el-breadcrumb-item>Role List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table style="margin-top:50px" max-height="400" border :data="roleList">
        <el-table-column prop="id" label="Role ID" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="name" label="Role Name" align="center" :resizable="false"></el-table-column>
        <el-table-column label="User Rights" align="center" :resizable="false">
          <template slot-scope="scope">
            <el-popover placement="bottom-start" trigger="click">
              <el-table style="border:none;box-shadow:none" :data="modules">
                <el-table-column width="70" align="center" property="id" label="ID"></el-table-column>
                <el-table-column width="110" align="center" property="name" label="Right Name"></el-table-column>
              </el-table>
              <el-button slot="reference" @click="getDetails(scope.row.id)">Details</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      modules: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      this.$http
        .get("user/role")
        .then(res => {
          this.roleList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDetails(id) {
      console.log(id)
      this.$http
        .get("menu/module", { params: {id: id} })
        .then(res => {
          this.modules = res.data.data
        })
        .catch(error => {
          console.log(error);
        });
    },
    indexMethod(index) {
      return index;
    }
  }
};
</script>

<style lang="less" scoped>
.el-form {
  font-size: 0;
}
.el-form label {
  width: 90px;
  color: #99a9bf;
}
.el-form .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
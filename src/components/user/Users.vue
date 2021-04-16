<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>User Manage</el-breadcrumb-item>
      <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="Enter user name."
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-tooltip effect="dark" content="Add user" placement="bottom-start" :enterable="false">
            <el-button type="primary" icon="el-icon-document-add" circle @click="addDialog = true"></el-button>
          </el-tooltip>
        </el-col>
        <el-dialog title="Add User" :visible.sync="addDialog" width="40%" center>
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item label="User name" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="Check pass" prop="passAgain">
              <el-input v-model="addForm.passAgain"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addUser()">Add User</el-button>
          </span>
        </el-dialog>
      </el-row>
      <el-table max-height="330" border :data="userList">
        <el-table-column
          fixed
          type="index"
          :index="indexMethod"
          label="Num."
          width="60"
          align="center"
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="name" label="User Name" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="time" label="Create Time" width="180" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="role" label="User Roles" width="150" align="center" :resizable="false"></el-table-column>
        <el-table-column label="Operations" width="140" align="center" :resizable="false">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="Edit user role" placement="bottom-start" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                style="margin-right:20px"
                circle
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="Delete user" placement="bottom-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="delUser(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="Edit User Role" :visible.sync="editDialog" width="40%" center>
        <el-form :model="editForm" ref="editFormRef" label-width="100px">
          <el-form-item label="User name" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="User role" prop="role">
            <el-select v-model="editForm.role">
              <el-option label="admin" value="admin"></el-option>
              <el-option label="user" value="user"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editUser()">Update User</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validateUname = (rule, value, callback) => {
      if (value == "") callback(new Error("Enter user name."));
      else if (value.length < 3 || value.length > 15)
        callback(new Error("User name length is between 3 and 15."));
      else callback();
    };
    var validatePWD = (rule, value, callback) => {
      if (value == "") callback(new Error("Check password."));
      else if (value.length < 3 || value.length > 15)
        callback(new Error("Password length is between 3 and 15."));
      else if (this.addForm.passAgain != this.addForm.password)
        callback(new Error("Password is inconsistent."));
      else callback();
    };
    return {
      queryInfo: {
        query: ""
      },
      addDialog: false,
      addForm: {
        username: "",
        password: "",
        passAgain: ""
      },
      addFormRules: {
        username: [
          { required: true, validator: validateUname, trigger: "blur" }
        ],
        password: [{ required: true, validator: validatePWD, trigger: "blur" }],
        passAgain: [{ required: true, validator: validatePWD, trigger: "blur" }]
      },
      editDialog: false,
      editForm: {
        id: "",
        username: "",
        role: ""
      },
      userList: []
    };
  },
  created() {
    this.getUserList();
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.addForm = {
          id: "",
          password: "",
          passAgain: ""
        };
        this.$refs.addFormRef.resetFields();
      }
    }
  },
  methods: {
    getUserList() {
      this.$http
        .get("user", { params: this.queryInfo })
        .then(res => {
          if (res.data.meta.status != 200)
            return this.$message.error(res.data.meta.msg);
          this.userList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    indexMethod(index) {
      return index;
    },
    resetAdd() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate((valid, result) => {
        if (!valid) {
          var arr = [];
          for (var i in result) arr.push(result[i][0].message);
          return this.$message.error(arr[0]);
        }
        this.$http
          .post("user/add", this.addForm)
          .then(res => {
            this.addDialog = false;
            if (res.data.meta.status != 200)
              return this.$message.error(res.data.meta.msg);
            this.$message.success("Add user succeeded.");
            this.getUserList();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    showEditDialog(usr) {
      this.editDialog = true;
      this.editForm = {
        id: usr.id,
        username: usr.name,
        role: usr.role
      };
    },
    editUser() {
      this.$refs.editFormRef.validate((valid, result) => {
        if (!valid) {
          var arr = [];
          for (var i in result) arr.push(result[i][0].message);
          return this.$message.error(arr[0]);
        }
        this.$http
          .post("user/edit", this.editForm)
          .then(res => {
            this.editDialog = false;
            if (res.data.meta.status != 200)
              return this.$message.error(res.data.meta.msg);
            this.$message.success("Edit user role succeeded.");
            this.getUserList();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    delUser(id) {
      this.$confirm("User will be permanently deleted, cntinue to delete?", "Tips", {
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("user/del", { id: id })
            .then(res => {
              if (res.data.meta.status != 200)
                return this.$message.error(res.data.meta.msg);
              this.$message.success(res.data.meta.msg);
              this.getUserList();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("Delete cancelled.");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  width: auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
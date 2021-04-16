<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>User Manage</el-breadcrumb-item>
      <el-breadcrumb-item>User Info.</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="6" :offset="2">User Name</el-col>
          <el-col :span="13" :offset="1">{{userInfo.name}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" :offset="2">Password</el-col>
          <el-col :span="13" :offset="1">
            <el-tooltip effect="dark" content="Edit password" placement="bottom-start" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="editPwd()"></el-button>
            </el-tooltip>
          </el-col>
          <el-dialog title="Edit password" :visible.sync="editDialog" width="40%" center>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
              <el-form-item label="Password" prop="password">
                <el-input v-model="editForm.password"></el-input>
              </el-form-item>
              <el-form-item label="Check pass" prop="passAgain">
                <el-input v-model="editForm.passAgain"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="editUser()">Edit</el-button>
            </span>
          </el-dialog>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" :offset="2">User Role</el-col>
          <el-col :span="13" :offset="1">{{userInfo.role}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" :offset="2">Create Time</el-col>
          <el-col :span="13" :offset="1">{{userInfo.time}}</el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePWD = (rule, value, callback) => {
      if (value == "") callback(new Error("Check password."));
      else if (value.length < 3 || value.length > 15)
        callback(new Error("Password length is between 3 and 15."));
      else if (this.editForm.passAgain != this.editForm.password)
        callback(new Error("Password is inconsistent."));
      else callback();
    };
    return {
      editDialog: false,
      editForm: {
        id: "",
        password: "",
        passAgain: ""
      },
      editFormRules: {
        password: [{ required: true, validator: validatePWD, trigger: "blur" }],
        passAgain: [{ required: true, validator: validatePWD, trigger: "blur" }]
      },
      userInfo: {}
    };
  },
  created() {
    this.getUserInfo();
  },
  watch: {
    editDialog(val) {
      if (!val) {
        this.editForm = {
          id: "",
          password: "",
          passAgain: ""
        };
        this.$refs.editFormRef.resetFields();
      }
    }
  },
  methods: {
    getUserInfo() {
      this.$http
        .get("user/info")
        .then(res => {
          this.userInfo = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    editPwd() {
      this.$prompt("Enter password", "Tips", {
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel"
      })
        .then(({ value }) => {
          if (value == this.userInfo.pwd) this.editDialog = true;
          else this.$message.error("Wrong password, no permission to edit.");
        })
        .catch(() => {
          this.$message.info("Edit cancelled.");
        });
    },
    editUser() {
      this.editForm.id = this.userInfo.id;
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
            this.$message.success("Edit succeeded, login again.");
            window.sessionStorage.clear();
            this.$router.push("/edit");
            this.$router.go(0);
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding-top: 70px;
}
.el-card {
  background: #134857;
}
.el-row {
  margin-bottom: 20px;
  line-height: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
    background: #eef7f2;
    color: #134857;
  }
}
</style>
<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="toggle-btn">
          <img src="../assets/logo.png" @click="toggle()" />
          <span @click="toDoc()">CC-Map</span>
        </div>
        <div class="login-box">
          <el-button
            type="success"
            plain
            round
            v-if="isLogin == false"
            @click="loginDialog = true"
          >Login</el-button>
          <el-dialog :visible.sync="loginDialog" center>
            <div class="login-form">
              <div class="logo-box">
                <img src="../assets/logo.png" />
              </div>
              <el-form :model="loginForm" status-icon :rules="loginFormRules" ref="loginFormRef">
                <el-form-item prop="username">
                  <el-input
                    placeholder="Enter user name."
                    v-model="loginForm.username"
                    prefix-icon="el-icon-user"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    placeholder="Enter password."
                    v-model="loginForm.password"
                    prefix-icon="el-icon-lock"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item></el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="login()">Sign in</el-button>
            </span>
          </el-dialog>
          <el-button type="primary" plain round v-show="isLogin" @click="logout()">Logout</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            :default-active="activePath"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/'+subItem.path)"
              >
                <i :class="iconObj[subItem.id]"></i>
                <span>{{subItem.name}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    var validateUname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Enter user name."));
      } else {
        callback();
      }
    };
    var validatePWD = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Enter password."));
      } else {
        callback();
      }
    };
    return {
      asideWidth: "200",
      isLogin: false,
      loginDialog: false,
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRules: {
        username: [{ validator: validateUname, trigger: "blur" }],
        password: [{ validator: validatePWD, trigger: "blur" }]
      },
      isCollapse: false,
      activePath: "edit",
      menuList: [],
      iconObj: {
        "101": "el-icon-s-custom",
        "102": "el-icon-bank-card",
        "103": "el-icon-s-management",
        "104": "el-icon-collection-tag",
        "105": "el-icon-menu",
        "106": "el-icon-edit-outline",
        "107": "el-icon-s-operation",
        "108": "el-icon-upload"
      }
    };
  },
  created() {
    this.isLogin =
      window.sessionStorage.getItem("token") != null ? true : false;
    this.activePath =
      window.sessionStorage.getItem("activePath") != null
        ? window.sessionStorage.getItem("activePath")
        : "/edit";
  },
  watch: {
    isLogin(val) {
      if (val) {
        let w = document.body.offsetWidth;
        if (w < 700) {
          this.isCollapse = true;
        }
        this.getMenuList();
        this.asideWidht = "200px";
      } else this.asideWidht = "0px";
    },
    isCollapse(val) {
      this.asideWidht = this.isCollapse ? "64px" : "200px";
    },
    loginDialog(val) {
      if (!val) {
        this.loginForm = {
          id: "",
          password: "",
          passAgain: ""
        };
        this.$refs.loginFormRef.resetFields();
      }
    }
  },
  methods: {
    toDoc() {
      this.$router.push("/");
    },
    getMenuList() {
      this.$http
        .get("menu")
        .then(res => {
          if (res.data.meta.status != 200)
            return this.$message.error(res.data.meta.msg);
          this.menuList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    login() {
      this.$refs.loginFormRef.validate((valid, result) => {
        if (!valid) {
          var arr = [];
          for (var i in result) arr.push(result[i][0].message);
          return this.$message.error(arr[0]);
        }
        this.$http
          .post("/login", this.loginForm)
          .then(res => {
            this.loginDialog = false;
            if (res.data.meta.status != 200)
              return this.$message.error(res.data.meta.msg);
            this.$message.success("Login succeeded.");
            window.sessionStorage.setItem("token", res.data.data.token);
            this.isLogin = true;
            this.getMenuList();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    logout() {
      window.sessionStorage.clear();
      this.$message.success("Exited.");
      this.isLogin = false;
      this.$router.push("/edit");
      this.$router.go(0);
    },
    toggle() {
      if (this.isLogin) this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    }
  }
};
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      background-image: -webkit-linear-gradient(#63bbd0, #0f95b0, #126e82);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .toggle-btn {
        display: flex;
        height: 100%;
        width: 200px;
        align-items: center;
        color: #eef7f2;
        font-size: 30px;
        font-weight: 700;
        cursor: pointer;

        img {
          height: 100%;
          border-radius: 50%;
          margin-right: 2%;
        }
      }

      .login-box {
        @media screen and (min-width: 700px) {
          .el-dialog {
            width: 450px;
          }
        }
        @media screen and (max-width: 700px) {
          .el-dialog {
            width: 80%;
          }
        }
        .login-form {
          height: 110px;
          width: 100%;
          .logo-box {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%, -50%);
            height: 130px;
            width: 130px;
            border: 1px solid #eeeeee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #dddddd;
            background: rgba(255, 255, 255, 0.6);
            box-sizing: border-box;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: #eeeeee;
            }
          }

          .log-btn {
            background: #132c33;
          }

          .el-form {
            position: absolute;
            top: 30%;
            right: 10%;
            left: 10%;
            height: 130px;
            box-sizing: border-box;
          }
        }
        .el-button {
          margin: 20px;
        }
      }
    }

    .el-aside {
      background-color: #132c33;
      color: #333;
      text-align: center;
      line-height: 200px;

      .el-menu {
        border: none;

        .el-menu-item {
          text-align: left;
        }
      }
    }

    .el-main {
      background-color: #132c33;
      color: #333;
      text-align: center;
      line-height: 160px;
    }
  }
}
</style>

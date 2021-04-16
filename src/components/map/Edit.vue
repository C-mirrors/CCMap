<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Map Edit</el-breadcrumb-item>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-more el-icon--right" style="font-size:15px"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-document-add" command="new">New</el-dropdown-item>
          <el-dropdown-item icon="el-icon-s-order" command="save">Save</el-dropdown-item>
          <el-dropdown-item icon="el-icon-view" command="show">Show</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-breadcrumb>
    <el-card>
      <el-tree
        :data="[mapJson]"
        node-key="node.data.id"
        default-expand-all
        draggable
        :expand-on-click-node="false"
        :render-content="nodeRender"
      ></el-tree>
    </el-card>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      id: "",
      mapJson: {},
      defaultJson: {
        data: { id: "root", text: "New Map" },
        children: []
      }
    };
  },
  created() {
    if (this.$route.query.map != undefined) {
      this.mapJson = JSON.parse(this.$route.query.map);
      this.id = this.$route.query.mapid;
    } else this.mapJson = this.defaultJson;
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "new":
          this.mapJson = this.defaultJson;
          this.$router.go(0);
          break;
        case "save":
          if (window.sessionStorage.getItem("token") == null)
            this.$message.error("Not logged in, unable to save.");
          else if (this.id != "")
            this.$http
              .post("file/edit", { map: this.mapJson, id: this.id })
              .then(res => {
                if (res.data.meta.status != 200)
                  return this.$message.error(res.data.meta.msg);
                this.$message.success("Saved succeeded.");
                this.$router.push({
                  path: "/edit",
                  query: { mapid: this.id, map: JSON.stringify(this.mapJson) }
                });
              })
              .catch(error => {
                console.log(error);
              });
          else
            this.$confirm("File non-existent, save after uploading?", "Tips", {
              confirmButtonText: "Sure",
              cancelButtonText: "Cancel",
              type: "warning"
            })
              .then(() => {
                this.$prompt("Eter file name", "Save", {
                  confirmButtonText: "Sure",
                  cancelButtonText: "Cancel"
                })
                  .then(({ value }) => {
                    this.$http
                      .post("file/saveas", { name: value, map: this.mapJson })
                      .then(res => {
                        if (res.data.meta.status != 200)
                          return this.$message.error(res.data.meta.msg);
                        this.$message.success(res.data.meta.msg);
                        this.$router.push("/files");
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  })
                  .catch(() => {
                    this.$message.info("Save cancelled.");
                  });
              })
              .catch(() => {
                this.$message.info("Save cancelled.");
              });
          break;
        case "show":
          this.$router.push({
            path: "/map",
            query: { mapid: this.id, map: JSON.stringify(this.mapJson) }
          });
          break;
      }
    },
    editNode(data) {
      this.$prompt(data.data.text, "Edit", {
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel"
      })
        .then(({ value }) => {
          data.data.text = value;
          this.$message.success("Node edited");
        })
        .catch(() => {
          this.$message.info("Edit cancelled.");
        });
    },
    addNode(data) {
      const newChild = {
        data: { id: "node" + Date.now(), text: "newNode" },
        children: []
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    delNode(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.data.id === data.data.id);
      children.splice(index, 1);
    },
    nodeRender(h, { node, data, store }) {
      return (
        <span>
          <span style="margin-left:10px;margin-right:20px">
            <el-button
              size="mini"
              type="text"
              on-click={() => this.delNode(node, data)}
            >
              <i class="el-icon-remove-outline"></i>
            </el-button>
          </span>
          <span on-click={() => this.editNode(data)}>{data.data.text}</span>
          <span style="margin-left:20px">
            <el-button
              size="mini"
              type="text"
              on-click={() => this.addNode(data)}
            >
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </span>
        </span>
      );
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  overflow: auto;
  @media screen and (min-width: 700px) {
    .el-tree {
      margin-left: 50%;
      transform: translate(-50%);
    }
  }
  @media screen and (max-width: 700px) {
    .el-tree {
      margin-left: 0;
    }
  }
  .el-tree {
    margin-top: 20px;
    font-size: 20px;
    box-shadow: 0 0 3px #0f95b0;
    -webkit-box-shadow: 0 0 3px #0f95b0;
  }
}
</style>
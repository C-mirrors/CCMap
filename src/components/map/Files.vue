<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Map List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="Enter file name."
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getFileList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getFileList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-upload
            action="upload"
            :http-request="upFile"
            :before-remove="beforeRemove"
            :multiple="false"
            :show-file-list="false"
            accept="application/json"
            :file-list="upFileList"
          >
            <el-tooltip effect="dark" content="Upload file" placement="bottom-start" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-document-add"
                circle
                @click="$message.success('Upload JSON files, no more than 500kb.')"
              ></el-button>
            </el-tooltip>
          </el-upload>
        </el-col>
      </el-row>
      <el-table max-height="330" border :data="allFiles">
        <el-table-column
          fixed
          type="index"
          :index="indexMethod"
          label="Num."
          width="60"
          align="center"
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="name" label="File Name" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="time" label="Upload Time" width="150" align="center" :resizable="false"></el-table-column>
        <el-table-column label="Operations" width="180" align="center" :resizable="false">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="Edit Map" placement="bottom-start" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editFile(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="Export Map"
              placement="bottom-start"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-paperclip"
                circle
                @click="exportMap(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="Delete Map" placement="bottom-start" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-document-delete"
                circle
                @click="delFile(scope.row.id)"
              ></el-button>
            </el-tooltip>
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
      queryInfo: {
        query: ""
      },
      allFiles: [],
      upFileList: []
    };
  },
  created() {
    this.getFileList();
  },
  methods: {
    getFileList() {
      this.$http
        .get("file", { params: this.queryInfo })
        .then(res => {
          if (res.data.meta.status != 200)
            return this.$message.error(res.data.meta.msg);
          this.allFiles = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    indexMethod(index) {
      return index;
    },
    beforeRemove(file, upFileList) {
      return this.$confirm(`Remove ${file.name}？`);
    },
    upFile(files) {
      var formData = new FormData();
      formData.append("file", files.file);
      this.$http
        .post("file/upload", formData)
        .then(res => {
          this.upDialog = false;
          if (res.data.meta.status != 200)
            return this.$message.error(res.data.meta.msg);
          this.$message.success(res.data.meta.msg);
          this.getFileList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    editFile(id) {
      this.$http
        .get("file/map", { params: { id: id } })
        .then(res => {
          if (res.data.meta.status != 200)
            return this.$message.error(res.data.meta.msg);
          this.$router.push({
            path: "/edit",
            query: { mapid: id, map: res.data.data }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    exportMap(id) {
      this.$http
        .get("file/map", { params: { id: id } })
        .then(res => {
          if (res.data.meta.status != 200)
            return this.$message.error(res.data.meta.msg);
          this.$router.push({
            path: "/map",
            query: { mapid: id, map: res.data.data }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    delFile(id) {
      this.$confirm("File will be permanently deleted, cntinue to delete?", "Tips", {
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("file/del", { id: id })
            .then(res => {
              if (res.data.meta.status != 200)
                return this.$message.error(res.data.meta.msg);
              this.$message.success(res.data.meta.msg);
              this.getFileList();
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
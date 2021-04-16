<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Map Edit</el-breadcrumb-item>
      <el-breadcrumb-item>Map Show</el-breadcrumb-item>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-more el-icon--right" style="font-size:15px"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-paperclip" command="toPng">Export(.png)</el-dropdown-item>
          <el-dropdown-item icon="el-icon-edit" command="edit">Edit</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-breadcrumb>
    <!-- <ultree :data="mapJson" /> -->
    <el-card id="container">
      <div id="svg-map">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          :viewBox="view"
          @click.prevent
          @contextmenu.prevent
        >
          <g cursor="pointer">
            <svgtree :data="mapJson" :width="size.width" :height="size.height" />
          </g>
        </svg>
      </div>
    </el-card>
  </div>
</template>

<script>
import preTree from "./tree/tree";
import svgTree from "./tree/SVGTree.vue";
import ulTree from "./tree/UlTree.vue";
import svgTrans from "./svg";
export default {
  components: {
    svgtree: svgTree,
    ultree: ulTree
  },
  data() {
    return {
      size: {
        width: 400,
        height: 400
      },
      view: "0 0 400 400",
      id: "",
      mapJson: {}
    };
  },
  created() {
    this.id = this.$route.query.mapid;
    this.mapJson = JSON.parse(this.$route.query.map);
    this.mapJson = preTree.treePre(this.mapJson);
  },
  computed: {},
  mounted() {
    svgTrans.Init("svg-map");
  },
  methods: {
    formatPx(d) {
      return parseInt(d);
    },
    handleCommand(command) {
      switch (command) {
        case "toPng":
          var serializer = new XMLSerializer();
          var svg = document.querySelector('svg');
          var toExport = svg.cloneNode(true);
          var bb = svg.getBBox();
          toExport.setAttribute('viewBox', bb.x + ' ' + bb.y + ' ' + bb.width + ' ' + bb.height);
          toExport.setAttribute('width', bb.width);
          toExport.setAttribute('height', bb.height);
          var source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(toExport);
          var image = new Image;
          image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
          var canvas = document.createElement("canvas");
          canvas.width = bb.width;
          canvas.height = bb.height;
          var context = canvas.getContext("2d");
          context.fillStyle = '#fff';//#fff设置保存后的PNG 是白色的  
          context.fillRect(0, 0, 10000, 10000);
          image.onload = function() {  
            context.drawImage(image, 0, 0);  
            var a = document.createElement("a");  
            a.download = "Atlas.png";  
            a.href = canvas.toDataURL("image/png");
            a.click();
          }
          break;
        case "edit":
          this.$router.push({
            path: "/edit",
            query: { mapid: this.id, map: JSON.stringify(this.mapJson) }
          });
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
#container {
  width: auto;
  background: oldlace;
  overflow: hidden;
  background: #d8e3e7;
}
#svg-map {
  height: 400px;
}
</style>
<template>
  <g>
    <svg-tree v-for="node in data.children" :data="node" :key="node.data.id" />
    <g>
      <svgline
        :node="data"
        :link-stroke="linkStroke"
        :link-stroke-width="linkStrokeWidth"
      />
    </g>
    <g>
      <svgnode
        :node="data"
        :node-fill="nodeFill"
        :node-text-color="nodeTextColor"
      />
    </g>
  </g>
</template>

<script>
import svgNode from "./SVGNode";
import svgLine from "./SVGLine";
export default {
  name: "svg-tree",
  components: {
    svgnode: svgNode,
    svgline: svgLine
  },
  props: {
    data: {
      type: Object
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    nodeFill: {
      type: String,
      default: "#474b4c"
    },
    nodeTextColor: {
      type: String,
      default: "#eef7f2"
    },
    linkStroke: {
      type: String,
      default: "#000"
    },
    linkStrokeWidth: {
      type: [String, Number],
      default: 2
    }
  },
  data() {
    return {
      size: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    containerSize() {
      let width = this.width || this.size.width + 20;
      let height = this.height || this.size.height + 20;
      return {
        width: this.formatPx(width),
        height: this.formatPx(height)
      };
    }
  },
  created() {},
  methods: {
    formatPx(d) {
      return (d + "").replace(/[px]/gi, "") + "px";
    }
  }
};
</script>

<style lang="less" scoped>
</style>
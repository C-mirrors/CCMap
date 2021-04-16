<template>
  <g>
    <path :d="node.pos.line" :stroke="linkStroke" fill="none" :stroke-width="linkStrokeWidth"></path>
  </g>
</template>

<script>
export default {
  props: {
    node: {
      type: Object
    },
    linkStroke: {
      type: String
    },
    linkStrokeWidth: {
      type: [String, Number]
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
</style>
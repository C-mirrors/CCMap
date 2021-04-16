<template>
  <ul>
    <li class="text-node" @click="show()">{{data.data.text}}</li>
    <text-tree v-for="node in data.children" :data="node" :key="node.data.id" />
  </ul>
</template>
<script>
export default {
  name: "text-tree",
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.text-node {
  width: 100px;
  line-height: 30px;
  border: 2px solid rgb(192, 128, 128);
  margin: 10px;
}
</style>
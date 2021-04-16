<template>
  <g :transform="rootTransform">
    <rect rx="10" ry="10" :width="nodeWidth" :height="nodeHeight" :fill="nodeFill"></rect>
    <text
      :fill="nodeTextColor"
      text-anchor="middle"
      dominant-baseline="middle"
      :width="nodeWidth"
      :height="nodeHeight"
      :y="nodeHeight / 2"
      :x="nodeWidth / 2"
      class="text"
      @dblclick="edit"
    >{{node.data.text}}</text>
    <foreignObject 
      v-show=isEdit
      :width="nodeWidth"
      :height="nodeHeight"
    ><div 
        contenteditable="true" 
        :id="node.data.id" 
        @blur="divBlur"
        tabindex="-1"
        class="txt"
     >{{node.data.text}}</div></foreignObject>
  </g>
</template>

<script>
export default {
  props: {
    node: {
      type: Object
    },
    nodeWidth:{
      type: [String, Number],
      default: 100
    },
    nodeHeight:{
      type: [String, Number],
      default: 50
    },
    nodeFill: {
      type: String
    },
    nodeTextColor: {
      type: String
    },
    isHover: false
  },
  data() {
    return {
      isEdit: false,
    };
  },
  methods: {
    edit(){
      this.isEdit = true;
    },
    divBlur(){
      this.node.data.text = document.getElementById(this.node.data.id).textContent;
      this.isEdit = false;
    }
  },
  computed: {
    rootTransform() {
      return `translate(${this.node.pos.x}, ${this.node.pos.y})`;
    }
  }
};
</script>

<style lang="less" scoped>
.text {
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
  padding: 1px;
}
.txt {
  background-color: white;
  color: #000;
  margin-top:10px;
  min-height: 30px;
  min-width: 100px;
}
</style>
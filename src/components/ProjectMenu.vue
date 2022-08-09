<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item index="1" @click="toProject">返回</el-menu-item>
    <el-menu-item index="2" @click="toProjectInfo">项目简介</el-menu-item>
    <el-menu-item index="3" @click="toDocsList">编辑文档</el-menu-item>
    <el-menu-item index="4" @click="toDraw">设计原型</el-menu-item>
    <el-menu-item index="5"><a href="http://www.diagrams.net/" target="_blank">绘制 UML</a></el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "ProjectMenu",
  data(){
    return{
      activeIndex:''
    }
  },
  methods:{
    toProject() {
      this.$router.push('/manageProject');
    },
    toProjectInfo(){
      this.$router.push('/project');
    },
    toDraw(){
      this.$router.push('/draw');
    },
    toDocsList(){
      this.$router.push('/docsList');
    }
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
  line-height: 100%;
}
</style>
<template>
  <el-container>
    <el-header>
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
        <el-menu-item index="1" @click="showproj">返回</el-menu-item>
        <el-menu-item index="2">项目详情</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <el-row :gutter="40">
        <el-col :span="12" :offset="6">
          <div>
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>{{projname}}</span>
              </div>
              <div class="text item">
                <span>{{projectdiscrp}}</span>
              </div>
            </el-card>
            <el-button-group>
              <el-button type="primary" ><a href="http://www.diagrams.net/" target="_blank">绘制 UML</a></el-button>
              <el-button type="primary" @click="todraw">设计原型</el-button>
              <el-button type="primary" @click="todoc">编辑文档</el-button>
            </el-button-group>
          </div>
        </el-col>

      </el-row>
    </el-main>
  </el-container>
</template>

<script>

import qs from "qs";

export default {
  name: "ProjectInfo",
  data() {
    return {
      activeIndex: '2',
      projname: '测试',
      projectdiscrp: '城市水水水水水水水水水水水水水水'
    }
  },
  methods: {
    showproj: function () {
      this.$store.state.projectid=undefined;
      this.$router.push('/manageProject');
    },
    todraw(){
      this.$router.push('/design');
    },
    todoc(){
      this.$router.push('/documentEdit');
    },

  },
  mounted() {
    let id = this.$store.state.projectid;
    //console.log('在项目界面');
    //console.log(id);
    let that=this;
    this.$axios({
      url: '/initialprojectinformation/',
      method: 'post',
      data: qs.stringify({
        projectid: id
      })
    }).then(res => {
      switch (res.data.errornumber) {
        case 0:
          that.projname=res.data.projectname;
          that.projectdiscrp=res.data.projectdescpt;
          break;
        case 1:
          this.$message.error("请求方式错误");
          break;
      }
    })
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
  color: white;
  line-height: 100%;
}
</style>
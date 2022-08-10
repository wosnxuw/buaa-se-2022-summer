<template>
  <div id="manage" class="manage">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <el-menu-item index="-1" @click="toChoose">返回</el-menu-item>
          <el-menu-item index="-2" @click="toProject">项目管理</el-menu-item>
          <el-menu-item index="-3" @click="toManageTeam">管理团队</el-menu-item>
          <el-menu-item index="-4" @click="toDocs">文档中心</el-menu-item>
          <el-menu-item index="-5" text-color="#eb5451">
            <el-button type="text" @click="logout">退出登陆</el-button>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
              default-active="3"
              class="el-menu-vertical-demo">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title" @click="toProject">项目一览</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title" @click="toRubbish">回收项目</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title" @click="toAdd">新建项目</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-row>
            <!--放置进度条-->
            <el-col :span="12" :offset="6"><div>
              <el-steps :active="step" align-center>
                <el-step title="输入项目名" description="起一个名字吧"></el-step>
                <el-step title="输入项目简介" description="为项目将要做什么撰写描述"></el-step>
              </el-steps>
            </div></el-col>
            <!--放置输入框-->
            <el-col :span="8" :offset="8"><div >
              <el-form :model="form" ref="form" class="form" >
                <el-form-item prop="text" v-show="a">
                  <el-input placeholder="项目名" type="text" v-model="form.projectname"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="text" v-show="b">
                  <el-input
                      placeholder="项目描述"
                      autosize
                      clearable
                      type="textarea"
                      v-model="form.projectdiscrp"
                      maxlength="100"
                      size="medium"
                      show-word-limit
                      autocomplete="off"
                      @keyup.enter.native="addproj"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div></el-col>
            <!--放置底部按钮-->
            <el-col :span="8" :offset="8"><div>
              <el-button-group v-show="a">
                <el-button type="primary" @click="toB">下一步</el-button>
              </el-button-group>
              <el-button-group v-show="b">
                <el-button type="primary" @click="toA">上一步</el-button>
                <el-button type="primary" @click="addproj">完成</el-button>
              </el-button-group>
            </div></el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "AddProject",
  data() {
    return {
      team:'',
      /*v-show使用*/
      a:true,
      b:false,
      /*进度条*/
      step:1,
      teamlist:[],
      /*标题选择用变量*/
      activeIndex: '-2',
      /*新建项目时 将会提交的数据*/
      form:{
        projectname:'',
        projectdiscrp:'',
        //teamname:''
      },
      options: [],
      value: ''
    }
  },
  methods: {
    toA(){
      this.step=1;
      this.b=this.c=false;
      this.a=true;
    },
    toB(){
      this.step=2;
      this.a=this.c=false;
      this.b=true;
    },
    logout() {
      this.$confirm('您即将退出登陆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /*给一个消息提示一下，不给也行*/
        this.$message({
          type: 'success',
          message: '退出成功!'
        });
        this.$store.dispatch('clear');
        this.$router.push('/login');
      }).catch(() => {
        this.$message({
          type: 'info',
          showClose: true,
          message: '已放弃'
        });
      });
    },
    toProject () {
      this.$router.push('/manageProject');
    },
    toRubbish() {
      this.$router.push('/manageRubbish');
    },
    toAdd(){
    },
    toManageTeam(){
      this.$router.push('/manageTeam');
    },
    toChoose(){
      this.$router.push('/chooseTeam');
    },
    toDocs(){
      this.$router.push('/docs');
    },
    addproj () {
      let that = this;
      this.$axios({
        method: 'post',
        url: '/insertproject/',
        data: qs.stringify({
          projectname:this.form.projectname,
          projectdiscrp:this.form.projectdiscrp,
          teamid:that.$store.state.teamid,
          id:that.$store.state.userid
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("新建项目成功！");
                this.$router.push('/manageProject')
                break;
              case 1:
                this.$message.error("队伍名错误或不存在");
                this.$router.push('/addProject')
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
    }
  },
  mounted() { //钩子
    /*什么都不用做*/
  }
}
</script>

<style scoped>
</style>
<template>
  <div id="manage" class="manage">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <el-menu-item index="1" @click="showproj" >项目中心</el-menu-item>
          <el-menu-item index="2" @click="showrubbish">回收站</el-menu-item>
          <el-menu-item index="3" @click="showAdd">新建项目</el-menu-item>
          <el-menu-item index="4" @click="toManageTeam">管理团队</el-menu-item>
          <el-menu-item index="5" text-color="#eb5451"> <el-button type="text" @click="logout">退出登陆</el-button></el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-main>
          <el-row>
            <!--放置进度条-->
            <el-col :span="12" :offset="6"><div>
              <el-steps :active="step" align-center>
                <el-step title="输入项目名" description="起一个名字吧"></el-step>
                <el-step title="选择项目所属团队" description="团队过多可以搜索寻找"></el-step>
                <el-step title="输入项目简介" description="为项目将要做什么撰写描述"></el-step>
              </el-steps>
            </div></el-col>
            <!--放置输入框-->
            <el-col :span="8" :offset="8"><div >
              <el-form :model="form" ref="form" class="form">
                <el-form-item prop="text" v-show="a">
                  <el-input placeholder="项目名" type="text" v-model="form.projectname"  autocomplete="off"></el-input>
                </el-form-item>
                <el-select v-model="value" filterable placeholder="请选择团队 或键入以搜索" v-show="b" id="choose-team">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <el-form-item prop="text" v-show="c">
                  <el-input
                      placeholder="项目描述"
                      autosize
                      clearable
                      type="textarea"
                      v-model="form.projectdiscrp"
                      maxlength="100"
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
                <el-button type="primary" @click="toC">下一步</el-button>
              </el-button-group>
              <el-button-group v-show="c">
                <el-button type="primary" @click="toB">上一步</el-button>
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
      /*v-show使用*/
      a:true,
      b:false,
      c:false,
      /*进度条*/
      step:1,
      teamlist:[],
      /*标题选择用变量*/
      activeIndex: '3',
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
    toC(){
      this.step=3;
      this.b=this.a=false;
      this.c=true;
    },
    toManageTeam(){
      this.$router.push('/manageTeam');
    },/*路由未定*/
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
    showproj: function () {
      this.$router.push('/manageProject');
    },
    showrubbish: function () {
      this.$router.push('/manageRubbish');
    },
    showAdd:function(){
      //this.$router.push('/addProject');
    },
    addproj:function () {
      this.$axios({
        method: 'post',
        url: '/insertproject/',
        data: qs.stringify({
          projectname:this.form.projectname,
          projectdiscrp:this.form.projectdiscrp,
          teamname:this.value
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
  },mounted() { //钩子
    const id=this.$store.state.userid;
    let that=this;
    //console.log('abc');
    this.$axios({
      url: '/getteammember/',
      method: 'post',
      data: qs.stringify({
        now_id:id
      })
    }).then(res => {
          switch (res.data.result) {
            case 0:
              that.teamlist=res.data.team_list;
              var i=0;
              for(i=0;i<that.teamlist.length;i++){
                that.options.push( {value:that.teamlist[i],label:that.teamlist[i]});
              }
              //console.log(that.options);
              break;
            case 1:
              this.$message.error("请求方式错误");
              break;
          }
        }
    );
  }
}
</script>

<style scoped>
</style>
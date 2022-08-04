<template>
  <div id="manage" class="manage">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
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
          <el-button type="text" @click="newTeam">新建队伍</el-button>

          <el-collapse v-model="activeName" accordion>
            <!--collapse-item和里面的内容都需要v-for循环-->

            <div  v-for="(item,index) in teamlist" :key="item">

            <el-collapse-item :title=item :name=index >

              <el-button type="success" plain @click="invite(index)"> 邀请成员 </el-button>
              <div v-for="(item2,index2) in userlist[index]" :key="item2">
                <el-divider></el-divider>
                {{ item2 }}
                <el-button size="mini" class="right" type="primary" plain @click="toManager(index,index2)">变更为管理员</el-button>
                <el-button size="mini" class="right"  type="danger" plain>移出团队</el-button>
              </div>
              <div v-for="(item3) in managerlist[index]" :key="item3">
                <el-divider></el-divider>
                {{ item3 }}
                <el-button size="mini" class="right" type="success" plain disabled>管理员</el-button>
              </div>
            </el-collapse-item>
            </div>

          </el-collapse>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "ManageTeam",
  data() {
    return {
      activeIndex: '4',
      activeName: '1',
      teamlist:['测试团队1','测试团队2'],
      userlist:[ ['张三 孙悟空 666@4.com 管理员' ,'张三 孙悟空 666@4.com 管理员','张三 孙悟空 666@4.com 管理员'] ,['张三 孙悟空 666@4.com 管理员']],
      emaillist:[['fgggg','fffff'],['ffff']],
      managerlist:[ ['张三 孙悟空 666@4.com 管理员' ,'张三 孙悟空 666@4.com 管理员','张三 孙悟空 666@4.com 管理员'] ,['张三 孙悟空 666@4.com 管理员']]
    };
  },
  methods:{
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
      this.$router.push('/addProject');
    },
    newTeam() {
      this.$prompt('请输入队伍名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的邮箱是: ' + value
        });
        /**/
        this.$axios({
          method: 'post',
          url: '',
          data: qs.stringify({
            userid:this.$store.getters.getUser(),
            teamname:value
          })
        })
            .then(res => {
              switch (res.data.errornumber) {
                case 0:
                  this.$message.success("新建团队成功，团队名为:"+value);
                  this.$router.push('/manageTeam');
                  break;
                case 1:
                  this.$message.error("请求方式错误");
                  break;
                case 2:
                  this.$message.error("团队名已存在");
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    invite(index){
      this.$prompt('请输入被邀请成员的邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的邮箱是: ' + value
        });
        var that=this;
        this.$axios({
          method: 'post',
          url: '',
          data: qs.stringify({
            email:value,
            teamname:that.teamlist[index]
          })
        })
            .then(res => {
              switch (res.data.errornumber) {
                case 0:
                  this.$message.success("新建团队成功，团队名为:"+value);
                  this.$router.push('/manageTeam');
                  break;
                case 1:
                  this.$message.error("请求方式错误");
                  break;
                case 2:
                  this.$message.error("团队名已存在");
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            })
        /**/
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    toManager(index,index2){
      var that=this;
      this.$axios({
        method: 'post',
        url: '',
        data: qs.stringify({
          email:that.emaillist[index][index2]
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$router.push('/manageTeam');
                break;
              case 1:
                this.$message.error("请求方式错误");
                break;
              case 2:
                this.$message.error("团队名已存在");
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
    }
  },
  mounted() {

    let that=this;
    this.$axios.get({
      url: '/user',
      method: 'get', // 默认值
      params: {
        userid:this.$store.getters.getUser()
      },
    }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              that.teamlist=res.data.teamlist;
              that.userlist=res.data.userlist;
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
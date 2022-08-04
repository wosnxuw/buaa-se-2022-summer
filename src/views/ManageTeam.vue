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
                <el-button size="mini" class="right"  type="danger" plain @click="deleteUser(index,index2)">移出团队</el-button>
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
      teamlist:[],
      userlist:[],
      emaillist:[],
      managerlist:[]
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
        const id=this.$store.state.userid;
        console.log(id);
        this.$axios({
          method: 'post',
          url: '/createteam/',
          data: qs.stringify({
            now_id:id,
            team_name:value
          })
        })
            .then(res => {
              switch (res.data.result) {
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
                case 3:
                  this.$message.error("用户不存在");
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
      this.$router.push('/manageTeam');
    },
    invite(index){
      this.$prompt('请输入被邀请成员的邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        var that=this;
        let id=this.$store.state.userid;
        console.log(id);
        console.log(value);
        console.log(that.teamlist[index]);
        this.$axios({
          method: 'post',
          url: '/inviteuser/',
          data: qs.stringify({
            now_userid:id,
            invite_useremail:value,
            teamname:that.teamlist[index],
          })
        })
            .then(res => {
              switch (res.data.result) {
                case 0:
                  this.$message.success("添加成员成功");
                  this.$router.push('/manageTeam');
                  break;
                case 2:
                  this.$message.error("不是管理员");
                  break;
                case 3:
                  this.$message.error("邀请用户不存在");
                  break;
                case 4:
                  this.$message.error("该用户已经在团队中");
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
    toManager(index,index2){
      var that=this;
      let id=this.$store.state.userid;
      console.log(that.emaillist[index][index2]);
      this.$axios({
        method: 'post',
        url: '/setadmin/',
        data: qs.stringify({
          id:id,
          teamname:that.teamlist[index],
          change_useremail:that.emaillist[index][index2]
        })
      })
          .then(res => {
            switch (res.data.result) {
              case 0:
                this.$message.success('已提升'+that.emaillist[index][index2]+'为管理员')
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
    },
    deleteUser(index,index2){
      var that=this;
      let id=this.$store.state.userid;
      console.log(that.emaillist[index][index2]);
      this.$axios({
        method: 'post',
        url: '/deleteuser/',
        data: qs.stringify({
          now_userid:id,
          teamname:that.teamlist[index],
          delete_useremail:that.emaillist[index][index2]
        })
      })
          .then(res => {
            switch (res.data.result) {
              case 0:
                this.$message.success('已移除'+that.emaillist[index][index2])
                this.$router.push('/manageTeam');
                break;
              case 1:
                this.$message.error("请求方式错误");
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
    }
  },
  mounted() {
    const id=this.$store.state.userid;
    console.log(id);
    let that=this;
    this.$axios({
      url: '/getteammember/',
      method: 'post',
      data: qs.stringify({
        now_id:id
      })
    }).then(res => {
          console.log('a');
          console.log(res.data.result);
          switch (res.data.result) {
            case 0:
              console.log('a');
              that.teamlist=res.data.team_list;
              that.userlist=res.data.big_list;
              that.emaillist=res.data.email_list;
              console.log(res.data.team_list);
              break;
          }
        }
    );
    this.$axios({
      url: '/getteamadmin/',
      method: 'post',
      data: qs.stringify({
        now_id:id
      })
    }).then(res => {
          switch (res.data.result) {
            case 0:
              console.log('b');
              that.managerlist=res.data.big_list;
              break;
          }
        }
    );
    console.log("c");
  }
}
</script>

<style scoped>

</style>
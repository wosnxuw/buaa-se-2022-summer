<template>
  <div id="manage" class="manage">
    <el-container>
      <el-header>
        <!--导航栏部分-->
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
        <el-main>
          <el-button type="text" @click="invite">邀请成员</el-button>
          <el-row :gutter="20">
            <el-col :span="16" :offset="4">
              <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                  <el-table-column
                      prop="name"
                      label="真实姓名"
                      width="180">
                  </el-table-column>
                  <el-table-column
                      prop="nickname"
                      label="昵称"
                      width="180">
                  </el-table-column>
                  <el-table-column
                      prop="email"
                      label="邮箱">
                  </el-table-column>
                  <el-table-column
                      label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" v-show="managerlist[scope.$index]" disabled>管理员</el-button>
                      <el-button @click="toManager(scope.$index)" type="text" size="small"
                                 v-show="!managerlist[scope.$index]">提升为管理
                      </el-button>
                      <el-button @click="deleteUser(scope.$index)" type="text" size="small"
                                 v-show="!managerlist[scope.$index]">移出团队
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import qs from "qs";

export default {
  inject: ['reload'],
  name: "ManageTeam",
  data() {
    return {
      /*标记哪个灯应该亮*/
      activeIndex: '-3',
      /*从后端获取的数据*/
      namelist: ['张三', '李四'],
      nicknamelist: ['喜羊羊', '灰太狼'],
      emaillist: ['bbb@qq.com', 'ccc@qq.com'],
      managerlist: [
        true, false
      ],
      teamlist: ['add', 'dddc'],
      tableData: [
        {
          name: '张三',
          nickname: '喜羊羊',
          email: '123@123.com'
        }, {
          name: '李四',
          nickname: '美羊羊',
          email: '234@123.com'
        }
      ]
    };
  },
  methods: {
    toManageTeam() {
      //this.$router.push('/manageTeam');
    },
    toDocs(){
      this.$router.push('/docs');
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
    toChoose(){
      this.$router.push('/chooseTeam');
    },
    invite() {
      this.$prompt('请输入被邀请成员的邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        let that =this;
        let id = this.$store.state.userid;
        this.$axios({
          method: 'post',
          url: '/inviteuser/',
          data: qs.stringify({
            now_userid: id,
            invite_useremail: value,
            teamid: that.$store.state.teamid,
          })
        })
            .then(res => {
              switch (res.data.result) {
                case 0:
                  this.$message.success("添加成员成功");
                  this.reload();
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
    toManager(index) {
      let that = this;
      let id = this.$store.state.userid;
      this.$axios({
        method: 'post',
        url: '/setadmin/',
        data: qs.stringify({
          id: id,
          teamid: that.$store.state.teamid,
          change_useremail: that.emaillist[index]
        })
      })
          .then(res => {
            switch (res.data.result) {
              case 0:
                this.$message.success('已提升')
                this.reload();
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
    deleteUser(index) {
      let that = this;
      let id = this.$store.state.userid;
      this.$axios({
        method: 'post',
        url: '/deleteuser/',
        data: qs.stringify({
          id: id,
          teamid: that.$store.state.teamid,
          delete_useremail: that.emaillist[index]
        })
      })
          .then(res => {
            switch (res.data.result) {
              case 0:
                this.$message.success('已移除')
                this.reload();
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
  /*初始化*/
  mounted() {
    let that = this;
    this.$axios({
      url: '//',
      method: 'post',
      data: qs.stringify({
        teamid: that.$store.state.teamid
      })
    }).then(res => {
          switch (res.data.result) {
            case 0:
              that.namelist = res.data.namelist;
              that.nicknamelist = res.data.nicknamelist;
              that.emaillist = res.data.emaillist;
              that.managerlist = res.data.managerlist;
              var i = 0;
              for (i = 0; i < res.data.emaillist.length; i++) {
                that.tableData.push({name: that.namelist[i], nickname: that.nicknamelist[i], email: that.emaillist[i]});
              }
              break;
          }
        }
    );
  },
}
</script>

<style scoped>
.el-table .success-row {
  background: #f0f9eb;
}
</style>
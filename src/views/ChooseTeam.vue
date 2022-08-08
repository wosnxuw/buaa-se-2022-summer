<template>
  <div id="manage" class="manage">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 @select="handleSelect">
          <el-menu-item index="-1">选择团队</el-menu-item>
          <el-menu-item index="-2" @click="newTeam">新建团队</el-menu-item>
          <el-menu-item index="-3" text-color="#eb5451">
            <el-button type="text" @click="logout">退出登陆</el-button>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="16" :offset="4">
            <div>
              <!--放置队伍的表格-->
              <el-table
                  :data="tableData.filter(data => !search || data.teamname.toLowerCase().includes(search.toLowerCase()))"
                  border
                  id="proj-show"
                  style="width: 100%">
                <el-table-column
                    prop="teamname"
                    label="队伍名">
                </el-table-column>
                <el-table-column
                    prop="createuser"
                    label="创建者">
                </el-table-column>
                <el-table-column
                    prop="createtime"
                    label="创建时间">
                </el-table-column>
                <el-table-column>
                  <!--eslint-disable-next-line-->
                  <template slot="header" slot-scope="scope">
                    <el-input
                        v-model="search"
                        size="mini"
                        placeholder="输入队伍名搜索"/>
                  </template>
                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-view"
                        @click="toProject(scope.$index)">进入团队
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "ChooseTeam",
  data() {
    return {
      tableData: [
        {
          teamname: '团队1',
          createuser: '张三',
          createtime: '2022-5-9'
        }, {
          teamname: '团队2',
          createuser: '李四',
          createtime: '2022-5-1'
        }
      ],
      search: '',
      activeIndex:'-1',
      teamidlist: [4,6]
    }
  },
  methods: {
    newTeam() {
      this.$prompt('请输入队伍名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        const id = this.$store.state.userid;
        //console.log(id);
        this.$axios({
          method: 'post',
          url: '/createteam/',
          data: qs.stringify({
            now_id: id,
            team_name: value
          })
        })
            .then(res => {
              switch (res.data.result) {
                case 0:
                  this.$message.success("新建团队成功，团队名为:" + value);
                  //this.$router.push('/manageTeam');
                  this.reload();
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
    },
    toProject(index) {
      this.$store.state.teamid = this.teamidlist[index];
      console.log("即将离开选择队伍界面，选择了："+this.$store.state.teamid)
      this.$router.push('/manageProject');
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
    }
  },
  mounted() {
    /*初始化本界面，不需要保存当前已选择的队伍id*/
    let that = this;
    this.$axios({
      url: '//',
      method: 'post',
      data: qs.stringify({
        id: that.$store.state.userid
      })
    }).then(res => {
          switch (res.data.result) {
            case 0:
              that.teamidlist = res.data.teamidlist;
              var i = 0;
              for (i = 0; i < res.data.teamlist.length; i++) {
                that.tableData.push({
                  team: res.data.teamlist[i],
                  createuser: res.data.createuserlist[i],
                  createtime: res.data.createtimelist[i]
                });
              }
              break;
          }
        }
    );
  }
}
</script>

<style scoped>

</style>
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
              default-active="2"
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
          <el-table
              :data="tableData"
              border
              id="proj-show">
            <el-table-column
                prop="projname"
                label="项目名">
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
                    placeholder="输入项目名搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-refresh-left"
                    @click="handleRedo(scope.$index, scope.row)">恢复
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)">彻底删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import qs from "qs";


export default {
  inject: ['reload'],
  name: "ManageRubbish",
  data() {
    return {
      search: '',
      activeIndex: '-2',
      projectidlist: [],
      /*整顿好的项目列表，待展示*/
      tableData: []
    }
  },
  methods: {
    toDocs(){
      this.$router.push('/docs');
    },
    toManageTeam() {
      this.$router.push('/manageTeam');
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
    toProject() {
      this.$router.push('/manageProject');
    },
    toRubbish() {
    },
    toAdd() {
      this.$router.push('/addProject');
    },
    toChoose(){
      this.$router.push('/chooseTeam');
    },
    handleDelete(index) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: '/deleteproject/',
          data: qs.stringify({
            projectid: this.projectidlist[index]
          })
        })
            .then(res => {
              switch (res.data.errornumber) {
                case 0:
                  this.$message.success("删除项目成功！");
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleRedo(index) {
      this.$axios({
        method: 'post',
        url: '/regainproject/',
        data: qs.stringify({
          projectid: this.projectidlist[index]
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("恢复项目成功！");
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
  mounted() { //钩子
    let that = this;
    this.$axios({
      url: '/initialgarbage/',
      method: 'post',
      data: qs.stringify({
        teamid: that.$store.state.teamid
      })
    }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              that.projectidlist = res.data.projectidlist;
              var max = that.projectidlist.length;
              for (var i = 0; i < max; i++) {
                that.tableData.push({projname: res.data.projectlist[i] ,createtime:res.data.createtimelist[i]});
              }
              break;
            case 1:
              this.$message.error("请求方式错误");
              break;
          }
        }
    );
  },
  computed: {
  }
}
</script>

<style scoped>

#proj-show {
  margin: 0 auto;
}

el-header {
  line-height: 100%;
}
</style>
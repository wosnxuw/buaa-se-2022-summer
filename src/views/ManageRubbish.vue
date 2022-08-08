<template>
  <div id="manage" class="manage">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 @select="handleSelect">
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
      team: '',
      search: '',
      /*标题选择用变量*/
      activeIndex: '-2',
      /*三个列表*/
      projectlist: [],
      projectidlist: [],
      teamlist: [],
      /*整顿好的项目列表，待展示*/
      tableData: [
        {
          projname: 'ffff',
          createtime: '2022-1-1'
        },
        {
          projname: 'dffff',
          createtime: '2022-1-1'
        },
        {
          projname: 'aaaa',
          createtime: '2022-1-1'
        }
      ]
    }
  },
  methods: {
    handleSelect(key) {
      /*注意：此函数点击任意一个导航栏图标都会触发，因此，不要使得key超出范围导致vuex改变*/
      if (key >= 0) {/*说明选择了一个队伍，而不是跳转链接*/
        this.$store.state.teamname = this.teamlist[key];
        console.log(key);
        console.log('已经选择:保存至vuex' + this.$store.state.teamname);
        this.reload();
      }
      console.log('该跳转了');
    },
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
    const id = this.$store.state.userid;
    //console.log(id);
    this.team = this.$store.state.teamname;
    let that = this;
    this.$axios({
      url: '/initialgarbage/',
      method: 'post',
      data: qs.stringify({
        userid: id
      })
    }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              that.projectlist = res.data.projectnamelist;
              that.projectidlist = res.data.projectidlist;
              that.teamlist = res.data.teamlist;
              //console.log(that.projectlist);
              //console.log(that.projectidlist);
              //console.log(that.teamlist);
              var max = that.projectlist.length;
              for (var i = 0; i < max; i++) {
                that.tableData.push({projname: that.projectlist[i], teamname: that.teamlist[i]});
              }
              break;
            case 1:
              this.$message.error("请求方式错误");
              break;
          }
        }
    );
    //console.log('dead')
  },
  computed: {
    getByProjectName(name) {
      let index = 0;
      let item;
      for (item in this.projectlist) {
        if (item == name) {
          break;
        }
        index++;
      }
      return this.projectidlist.indexOf(index)
    }
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
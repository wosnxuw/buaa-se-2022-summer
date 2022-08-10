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
              default-active="1"
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
          <!--放置文档 表格-->
          <el-table
              :data="tableData.filter(data => !search || data.projname.toLowerCase().includes(search.toLowerCase()))"
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
                    icon="el-icon-view"
                    @click="handleLook(scope.$index)">查看
                </el-button>
                <el-button
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index)">重命名
                </el-button>
                <el-button
                    size="mini"
                    icon="el-icon-document-copy"
                    type="warning" plain
                    @click="handleCopy(scope.$index)">复制
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-document-delete"
                    @click="handleDelete(scope.$index, scope.row)">移到回收站
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
  name: "ManageProject",
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
    toDocs(){
      this.$router.push('/docs');
    },
    toManageTeam() {
      this.$router.push('/manageTeam');
    },
    toProject() {
    },
    toRubbish() {
      this.$router.push('/manageRubbish');
    },
    toAdd() {
      this.$router.push('/addProject');
    },
    toChoose(){
      this.$router.push('/chooseTeam');
    },
    handleEdit(index) {
      this.$prompt('请输入项目新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '项目新名称'
      }).then(({value}) => {
        this.$message({
          type: 'success',
          message: '你把项目更名为: ' + value
        });
        let that = this;
        console.log('正在修改'+that.projectidlist[index]);
        this.$axios({
          method: 'post',
          url: '/renameproject/',
          data: qs.stringify({
            projectid: that.projectidlist[index],
            newprojectname: value,
          })
        })
            .then(res => {
              switch (res.data.errornumber) {
                case 0:
                  //console.log(that.projectidlist[index]);
                  this.reload();
                  break;
                case 1:
                  this.$message.error("失败");
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            })
      })
    },
    handleDelete(index) {
      let that = this;
      this.$axios({
        method: 'post',
        url: '/removeproject/',
        data: qs.stringify({
          projectid: that.projectidlist[index]
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("移动到回收站成功！");
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
    },
    handleLook(index) {
      this.$store.state.projectid = this.projectidlist[index];
      this.$router.push('/project');
    },
    handleCopy(index) {
      let that = this;
      this.$axios({
        method: 'post',
        url: '//',
        data: qs.stringify({
          projectid: that.projectidlist[index]
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("移动到回收站成功！");
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
    },
  },
  mounted() { //钩子
    let that = this;
    this.$axios({
      url: '/initialproject/',
      method: 'post',
      data: qs.stringify({
        teamid: that.$store.state.teamid
      })
    }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              //console.log('fafadfadfafaf');
              that.projectidlist = res.data.projectidlist;
              console.log(res.data.projectidlist);
              console.log(res.data.projectlist);
              console.log(res.data.createtimelist);
              var max = that.projectidlist.length;
              //console.log(max);
              for (var i = 0; i < max; i++) {
                that.tableData.push({projname: res.data.projectlist[i] ,createtime:res.data.createtimelist[i]});
              }
              //console.log(that.projectidlist);
              break;
            case 1:
              this.$message.error("请求方式错误");
              break;
          }
        }
    );
  },
  computed: {}
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
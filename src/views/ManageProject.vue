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
                    @click="handleEdit(scope.$index)">复制
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
      team: '',
      /*标题选择用变量*/
      search: '',
      activeIndex: '-2',
      /*三个列表*/
      projectlist: ['cccccc', 'ddddddd', 'fffffffffff'],
      projectidlist: ['1', '2', '3'],
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
        //console.log(that.projectidlist[index]);
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
      //console.log('项目管理');
      //console.log(index);
      this.$store.state.projectid = this.projectidlist[index];
      this.$router.push('/project');
    }
  },
  mounted() { //钩子
    const id = this.$store.state.userid;
    this.team = this.$store.state.teamname;
    //console.log(id);
    let that = this;
    this.$axios({
      url: '/initialproject/',
      method: 'post',
      data: qs.stringify({
        userid: id
      })
    }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              that.projectlist = res.data.projectnamelist;
              that.projectidlist = res.data.projectidlist;
              //console.log(that.projectlist);
              //console.log(that.projectidlist);
              //console.log(that.teamlist);
              var max = that.projectlist.length;
              for (var i = 0; i < max; i++) {
                that.tableData.push({projname: that.projectlist[i]});
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
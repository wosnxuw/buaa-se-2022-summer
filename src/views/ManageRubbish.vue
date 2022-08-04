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
          <el-table
              :data="tableData"
              border
              style="width: 80%"
              id="proj-show">
            <el-table-column
                prop="projname"
                label="项目名">
            </el-table-column>
            <el-table-column
                prop="teamname"
                label="所属团队">
            </el-table-column>
            <el-table-column label="操作" width="00">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
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
  name: "ManageRubbish",
  data() {
    return {
      /*标题选择用变量*/
      activeIndex: '2',
      /*三个列表*/
      projectlist:[],
      projectidlist:[],
      teamlist:[],
      /*整顿好的项目列表，待展示*/
      tableData: [
        {
          projname: '测试项目',
          teamname:'abc123'
        }, {
          projname: '测试项目',
          teamname:'abc123'
        }, {
          projname: '测试项目',
          teamname:'abc123'
        }, {
          projname: '测试项目',
          teamname:'abc123'
        }],
      /*新建项目时 将会提交的数据*/
    }
  },
  methods: {
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
    handleDelete(index) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.$axios({
          method: 'post',
          url: '',
          data: qs.stringify({
            projectid:this.projectidlist[index]
          })
        })
            .then(res => {
              switch (res.data.errornumber) {
                case 0:
                  this.$message.success("删除项目成功！");
                  this.$router.push('/manageRubbish');
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
        url: '',
        data: qs.stringify({
          projectid:this.projectidlist[index]
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("恢复项目成功！");
                this.$router.push('/manageRubbish');
                break;
              case 1:
                this.$message.error("请求方式错误");
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
      /*row表示第几行*/
    }
  },
  mounted() { //钩子
    const id=this.$store.state.userid;
    let that=this;
    console.log(id);
    this.$axios.get({
      url: '/user',
      method: 'get', // 默认值
      params: {
        userid:id
      },
    }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              that.projectlist=res.data.projectlist;
              that.projectidlist=res.data.projectidlist;
              that.teamlist=res.data.teamlist;
              break;
            case 1:
              this.$message.error("请求方式错误");
              break;
          }
        }

    );
  },
  computed:{
    getByProjectName(name){
      let index=0;
      let item;
      for (item in this.projectlist) {
        if (item==name){
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
el-form{
  width: 500px;
  margin: 0 auto;
}
el-input{
  width: 200px;
}
el-header{
  line-height: 100%;
}
</style>
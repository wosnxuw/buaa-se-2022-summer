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
          <el-menu-item index="4" > <el-button type="text" @click="toManageTeam"> 管理团队</el-button></el-menu-item>
          <el-menu-item index="5" text-color="#eb5451"> <el-button type="text" @click="logout"> 退出登陆</el-button></el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-main>
          <el-table
              :data="tableData"
              border
              style="width: 80%"
              id="proj-show"
              v-show="proj">
            <el-table-column
                prop="projname"
                label="项目名">
            </el-table-column>
            <el-table-column
                prop="teamname"
                label="所属团队">
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleLook(scope.$index, scope.row)">查看
                </el-button>
                <el-button
                    size="mini"
                    icon="el-icon-edit"
                    @click="handleEdit()">重命名
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)">移到回收站
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
              :data="tableData"
              border
              style="width: 80%"
              id="proj-show"
              v-show="rubbish">
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
                    @click="handleLook(scope.$index, scope.row)">恢复
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
          <el-form :model="form" ref="form" class="form" v-show="add">
            <el-form-item prop="text">
              <el-input placeholder="项目名" type="text" v-model="form.projectname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="text">
              <el-input
                  placeholder="项目描述"
                  autosize
                  type="text"
                  v-model="form.projectdiscrp"
                  maxlength="100"
                  show-word-limit
                  autocomplete="off"
                  @keyup.enter.native="addproj"
              ></el-input>
            </el-form-item>
            <el-select v-model="value" filterable placeholder="请选择团队 或键入以搜索">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <br>
            <el-form-item class="btn_add">
              <el-button type="primary" @click="addproj">新&nbsp;&nbsp;建</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import qs from "qs";
//import LogOut from "@/components/LogOut";

export default {
  name: "ManageProject",
  //components: {LogOut},
  data() {
    return {
      proj: true,
      rubbish: false,
      add: false,
      activeIndex: '1',
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
      form:{
        projectname:'',
        projectdiscrp:''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  methods: {
    /*
    toAdd: function () {
      this.$router.push('/add');
    },
    */
    toManageTeam(){
      this.$router.push('/login');
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
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    showproj: function () {

      this.rubbish=false;
      this.add=false;
      this.proj = true;
    },
    showrubbish: function () {

      this.proj = false;
      this.add=false;
      this.rubbish=true;
    },
    showAdd:function(){
      this.rubbish=false;
      this.proj = false;
      this.add=true;
    },
    addproj:function () {
      this.$axios({
        method: 'post',
        url: '',
        data: qs.stringify({
          projectname:this.form.projectname,
          projectdiscrp:this.form.projectdiscrp
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("新建项目成功！");
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
    handleEdit() {
      this.$prompt('请输入项目新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:'项目新名称'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你把项目更名为: ' + value
          /*
          *
          *
          * 等着写
          *
          * */
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    handleDelete(index, row) {
      this.$message({
        type: 'info',
        message: '点击了删除按钮'
      });
      this.$axios({
        method: 'post',
        url: '',
        data: qs.stringify({
          index: index,
          row: row
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("删除项目成功！");
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
    handleLook(row) {

      console.log(row);
      /*row表示第几行*/
    }
  },
  mounted() { //钩子
    //let that=this;

    this.$axios.get({
      url: '/user',
      method: 'get', // 默认值
      params: {
        userid:this.$store.getters.getUser
      },
    }).then(

    );
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
LogOut{
  display: inline;
  float: right;
}
#red{
  color: darkred;
}
</style>
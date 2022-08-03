<template>
  <div id="manage" class="manage">
    <el-container>
      <el-header>头部标题提示语</el-header>
      <el-container>
        <el-aside width="300px">
          <el-row class="left-nav">
            <el-col :span="12">
              <h5>写写写</h5>
              <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
              >
                <el-menu-item index="1">
                  <i class="el-icon-menu"></i>
                  <span slot="title" @click="showproj">项目</span>
                </el-menu-item>
                <el-menu-item index="2" @click="showrubbish">
                  <i class="el-icon-menu"></i>
                  <span slot="title">回收站</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-menu"></i>
                  <span slot="title" @click="showAdd">新建</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
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
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleLook(scope.$index, scope.row)">查看
                </el-button>
                <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">重命名
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
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

export default {
  name: "ManageProject",
  data() {
    return {
      proj: true,
      rubbish: false,
      add: false,
      tableData: [
        {
          projname: '测试项目'
        }, {
          projname: '测试项目'
        }, {
          projname: '测试项目'
        }, {
          projname: '测试项目'
        }],
      form:{
        projectname:'',
        projectdiscrp:''
      }
    }
  },
  methods: {
    /*
    toAdd: function () {
      this.$router.push('/add');
    },
    */
    showproj: function () {
      this.proj = true;
      this.rubbish=false;
      this.add=false;
    },
    showrubbish: function () {
      this.rubbish=true;
      this.proj = false;
      this.add=false;
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
    handleEdit(index) {
      console.log(index.data);
    },
    handleDelete(index, row) {
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
    this.$axios.get('data.json').then(response => (this.info = response.data));
  }
}
</script>

<style scoped>
.left-nav {
  height: 1000px;
}

#proj-show {
  margin: 0 auto;
}
el-form{
  width: 500px;
  margin: 0 auto;
}
el-input{
  width: 100%;
}
el-header{
  line-height: 100%;
}
</style>
<template>
  <el-container>
    <el-header>
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
        <el-menu-item index="1" @click="showproj">返回</el-menu-item>
        <el-menu-item index="2">项目详情</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <el-row :gutter="40">
        <el-col :span="12" :offset="6">
          <div>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{projname}}</span>
              </div>
              <div class="text item">
                <span>{{projectdiscrp}}</span>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8" :offset="4">
          <div>
            <el-card class="box-card">
              <div class="text item">
                <span>设计原型↓</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="newdraw">新建</el-button>
              </div>
            </el-card>
            <el-card class="box-card" shadow="hover" v-for="item in drawlist" :key="item">
              <div>
                <span>{{item}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-edit">编辑</el-button>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-card class="box-card">
              <div class="text item">
                <span>编辑文档↓</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="newdocs">新建</el-button>
              </div>
            </el-card>
            <el-card class="box-card" shadow="hover" v-for="item in docslist" :key="item">
              <div>
                <span>{{item}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-edit">编辑</el-button>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "ProjectInfo",
  data() {
    return {
      activeIndex: '2',
      docslist: ['dadada','dadddad'],
      drawlist: ['ddddddd','ccccccc'],
      projname: '测试',
      projectdiscrp: '城市水水水水水水水水水水水水水水'
    }
  },
  methods: {
    showproj: function () {
      this.$store.state.projectid=undefined;
      this.$router.push('/manageProject');
    },
    newdraw(){
      this.$prompt('请输入名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:'项目新名称'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你把项目更名为: ' + value
        });
        let id = this.$store.projectid;
        this.$axios.post({
          url: '/user',
          method: 'post',
          params: {
            projectid: id,
            drawname:value
          },
        }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              this.$message.error("新建成功");
              break;
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    newdocs(){
      this.$prompt('请输入名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:'项目新名称'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你把项目更名为: ' + value
        });
        let id = this.$store.projectid;
        this.$axios.post({
          url: '/user',
          method: 'post',
          params: {
            projectid: id,
            drawname:value
          },
        }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              this.$message.error("新建成功");
              break;
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    }
  },
  mounted() {
    let id = this.$store.state.projectid;
    console.log('在项目界面');
    console.log(id);
    let that=this;
    this.$axios.get({
      url: '/user',
      method: 'get',
      params: {
        projectid: id
      },
    }).then(res => {
      switch (res.data.errornumber) {
        case 0:
          that.projname=res.data.projname;
          that.projname=res.data.projectdiscrp;
          that.docslist=res.data.docslist;
          that.drawlist=res.data.drawlist;
          break;
        case 1:
          this.$message.error("请求方式错误");
          break;
      }
    })
  }
}
</script>

<style scoped>
el-menu {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>
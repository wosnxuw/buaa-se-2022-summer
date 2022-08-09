<template>
  <el-container>
    <el-header>
      <ProjectMenu>
      </ProjectMenu>
    </el-header>
    <el-container>
      <el-main>
        <el-row :gutter="40">
          <el-col :span="12" :offset="6">
            <el-card class="box-card">
              <el-button type="text" @click="dialogFormVisible = true">新建设计原型</el-button>
            </el-card>
            <el-dialog title="填写" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="名称">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false;newDraw">确 定</el-button>
              </div>
            </el-dialog>
            <el-card class="box-card" v-for="(item,index) in drawlist" :key="item">
              <div slot="header" class="clearfix">
                <span>{{ item }}</span>
                <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
              </div>
              <div class="text item">
                项目描述:{{drawdislist[index]}}
              </div>
              <div class="text item">
                创建者:{{drawdislist[index]}}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ProjectMenu from "@/components/ProjectMenu";
import qs from "qs";
export default {
  name: "DrawList",
  components: {ProjectMenu},
  data(){
    return{
      drawlist:['1dddd','ddddddd'],
      drawdislist:['ffff','fffffffffffffffffffffffff'],
      dialogFormVisible: false,
      form: {
        name: '',
        description: ''
      }
    }
  },
  methods:{
    newDraw(){
      let that=this;
      this.$axios({
        url: '//',
        method: 'post',
        data: qs.stringify({
          projectid:that.$store.state.projectid,
          drawname:that.form.name,
          description:that.form.description
        })
      }).then(res => {
        switch (res.data.errornumber) {
          case 0:
            this.$message.error("请求方式错误");
            this.reload();
            break;
          case 1:
            this.$message.error("请求方式错误");
            break;
        }
      })
    },
  },
  mounted() {
    let id = this.$store.state.projectid;
    let that=this;
    this.$axios({
      url: '/initialprojectinformation/',
      method: 'post',
      data: qs.stringify({
        projectid: id
      })
    }).then(res => {
      switch (res.data.errornumber) {
        case 0:
          that.drawlist=res.data.drawlist;
          that.drawdislist=res.data.drawdislist;
          that.drawidlist=res.data.drawidlist;
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
.box-card{
  margin-bottom: 20px;
}
</style>
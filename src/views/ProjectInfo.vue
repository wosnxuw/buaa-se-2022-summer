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
            <div>
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>{{projname}}</span>
                </div>
                <div class="text item">
                  <span>{{projectdiscrp}}</span>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import qs from "qs";
import ProjectMenu from "@/components/ProjectMenu";

export default {
  name: "ProjectInfo",
  components: {ProjectMenu},
  data() {
    return {
      activeIndex: '2',
      projname: 'xyz',
      projectdiscrp: '顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶'
    }
  },
  methods: {
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
          that.projname='项目名:'+res.data.projectname;
          that.projectdiscrp='项目简介:'+res.data.projectdiscpt;
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
a{
  text-decoration: none;
  line-height: 100%;
}
</style>
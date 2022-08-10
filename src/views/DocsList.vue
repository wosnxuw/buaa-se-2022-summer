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
              <el-button type="text" @click="dialogFormVisible = true">新建文档</el-button>
            </el-card>
            <el-dialog title="填写" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="名称">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择文档格式">
                  <el-select v-model="form.texttype" placeholder="文档格式">
                    <el-option label="MarkDown" value="m"></el-option>
                    <el-option label="Word" value="d"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false ; newDoc()">确 定</el-button>
              </div>
            </el-dialog>
            <el-card class="box-card" v-for="(item, index) in doclist" :key="item">
              <div slot="header" class="clearfix">
                <span>{{ item }}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="Edit(index)">编辑</el-button>
              </div>
              <div class="text item">
                文档描述:{{ docdislist[index] }}
              </div>
              <div class="text item">
                文档类型:{{ (ismdlist[index]==='m') ? 'MarkDown' : 'Word' }}
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
  inject: ['reload'],
  name: "DocsList",
  components: { ProjectMenu },
  data() {
    return {
      doclist: [],
      docdislist: [],
      docidlist: [],
      /*新增 是否是md文件*/
      ismdlist: [],
      dialogFormVisible: false,
      form: {
        name: '',
        description: '',
        texttype: ''
      }
    }
  },
  methods: {
    Edit(index) {
      this.$store.state.docid = this.docidlist[index];
      if (this.ismdlist[index]==='m') {
        this.$router.push('/markdownEdit');
      } else {
        this.$router.push('/documentEdit');
      }
    },
    newDoc() {
      console.log("进入新建函数体")
      let that = this;
      this.$axios({
        url: '/inserttext/',
        method: 'post',
        data: qs.stringify({
          projectid: that.$store.state.projectid,
          docname: that.form.name,
          description: that.form.description,
          texttype: that.form.texttype
        })
      }).then(res => {
        switch (res.data.errornumber) {
          case 0:
            this.$message.success("新建成功");
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
    let that = this;
    this.$axios({
      url: '/getdoclist/',
      method: 'post',
      data: qs.stringify({
        projectid: id
      })
    }).then(res => {
      switch (res.data.errornumber) {
        case 0:
          console.log('进入case');
          console.log(res.data.ismdlist);
          that.doclist = res.data.doclist;
          that.docdislist = res.data.docdislist;
          that.docidlist = res.data.docidlist;
          that.ismdlist = res.data.ismdlist;
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
.box-card {
  margin-bottom: 20px;
}
</style>
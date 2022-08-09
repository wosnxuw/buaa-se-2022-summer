<template>
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
            default-active="-4"
            class="el-menu-vertical-demo"
            @select="handleSelect">
          <div v-for="(item,i) in folderlist" :key="i">
            <el-submenu :index="(i+1).toString()">
              <template slot="title">
                <i class="el-icon-folder-opened"></i>
                <span>{{ item }}</span>
              </template>
              <div v-for="(item2,i2) in filelist[i]" :key="item2">
                <el-menu-item :index="(i+1)*10+i2"><i class="el-icon-document"></i>{{ item2 }}</el-menu-item>
              </div>
            </el-submenu>
          </div>
          <div v-for="(item,i) in mdlist" :key="item">
            <el-menu-item :index="(-1*i).toString()">
              <i class="el-icon-document"></i>
              <span slot="title">{{ item }}</span>
            </el-menu-item>
          </div>
          <el-menu-item>
            <i class="el-icon-document-add"></i>
            <span slot="title"  @click="addDoc">添加文档</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-empty description="在左侧选择文件以编辑" v-show="empty"></el-empty>
        <div id="app">
          <div id="editor-main" v-show="markdown">
            <le-editor v-model="value" :hljs-css="hljsCss" :image-uploader="imageUploader" @save="save"></le-editor>
          </div>
        </div>
        <DocEdit v-show="word"></DocEdit>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import DocEdit from "@/components/DocEdit";
import qs from "qs";

export default {
  name: "DocsView",
  components: {DocEdit},
  data() {
    return {
      hljsCss: 'agate',
      value: '## 在左侧选择md文件',
      // 自定义
      imageUploader: {
        custom: false,
        fileType: 'file',
        fileNameType: '',
        imagePrefix: 'http://106.54.92.121', // 图片上传成功后，预览地址前缀
        type: 'server',
        url: 'http://106.54.92.121:82/upload' // 上传接口地址
      },
      activeIndex: '-4',
      folderlist: ['项目11', '项目123'],
      filelist: [['文档1', '文档2'], ['文档4']],
      docidlist:[[13,35],[44]],
      /*idmdlist: [[false, true], false],*/
      mdlist: ['文件1', '文件1'],
      mdidlist:[14,34],
      word: false,
      markdown: false,
      empty: true,
      key: undefined,
    };
  },
  methods: {
    toDocs() {
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
    toChoose() {
      this.$router.push('/chooseTeam');
    },
    showWord() {
      this.empty = false;
      this.markdown = false;
      this.word = true;
    },
    showMarkDown() {
      this.empty = false;
      this.word = false;
      this.markdown = true;
    },
    showEmpty() {
      this.markdown = false;
      this.word = false;
      this.empty = true;
    },
    save () {
      // 获取预览文本
      //console.log(this.value) // 这里是原markdown文本
      //console.log(val) // 这个是解析出的html
      let that=this;
      this.$axios({
        method: 'post',
        url: '//',
        data: qs.stringify({
          mdid:that.$store.state.mdid,
          value:that.value
        })
      })
          .then(res => {
            switch (res.data.result) {
              case 0:
                this.$message.success("已保存");
                break;
            }
          })
    },
    addDoc(){/*只添加隶属于项目的文件*/
      this.$prompt('请输入文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        let that=this;
        this.$axios({
          method: 'post',
          url: '//',
          data: qs.stringify({
            teamid:that.$store.state.teamid
          })
        })
            .then(res => {
              switch (res.data.result) {
                case 0:
                  this.$message.success("已新建项目:" + value);
                  //this.$router.push('/manageTeam');
                  this.reload();
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
    handleSelect(key) {/*重点函数*//*点击文件夹无法触发这个函数，需要另写函数*/
      console.log(key);
      this.key = key;
      this.getText();
    },
    getText() {
      let that = this;
      let docid = undefined;
      let k = parseInt(this.key);
      if (k <= 0) { //说明选了md文件
        docid = this.mdidlist[-1 * k];
        this.showMarkDown();
      } else if (k >= 10) { //选了其他文件
        let a = k%10;
        let b = k/10;
        docid = this.docidlist[b-1][a];
      } else { //选了文件夹
        console.log('选了文件夹');
        this.showEmpty();
        return;
      }
      this.$store.state.docid=docid;
      //console.log('进入');
      console.log(docid);
      this.$axios({
        method: 'post',
        url: '//',
        data: qs.stringify({
          docid:docid
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                that.value=res.data.value;
                if (res.data.texttype){
                  this.showWord();
                }else{
                  this.showMarkDown();
                }
                this.$router.push('/manageProject')
                break;
              case 1:
                this.$router.push('/addProject')
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
    }
  }
}
</script>

<style scoped>
el-tree {
  margin-top: 20px;
  margin-left: 20px;
}

#app {
  width: 1200px;
  height: 500px;
  margin: 50px auto;
}

#editor-main {
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
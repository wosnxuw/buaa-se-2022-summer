<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64"
        text-color="#fff" active-text-color="#ffd04b">
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
        <el-menu default-active="-4" class="el-menu-vertical-demo" @select="handleSelect">
          <div v-for="(item, i) in folderlist" :key="i">
            <el-submenu :index="(i + 1).toString()">
              <template slot="title">
                <i class="el-icon-folder-opened"></i>
                <span class="folder">{{ item }}</span>
              </template>
              <div v-for="(item2, i2) in filelist[i]" :key="item2" class="file1">
                <el-menu-item :index="(i + 1) * 10 + i2"><i class="el-icon-document"></i>{{ item2 }}</el-menu-item>
              </div>
            </el-submenu>
          </div>
          <div v-for="(item, i) in mdlist" :key="item" class="file2">
            <el-menu-item :index="(-1 * i).toString()">
              <i class="el-icon-document"></i>
              <span slot="title">{{ item }}</span>
            </el-menu-item>
          </div>
          <el-menu-item>
            <i class="el-icon-document-add"></i>
            <span slot="title" @click="addDoc">添加文档</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-empty description="在左侧选择文件以编辑" v-show="empty"></el-empty>
        <div id="app" v-show="markdown">
          <div id="editor-main">
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
  inject: ['reload'],
  name: "DocsView",
  components: { DocEdit },
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
      folderlist: [],
      filelist: [],
      docidlist: [],
      mdlist: [],
      mdidlist: [],
      word: true,
      markdown: false,
      empty: false,
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
      this.$router.push('/manageProject');
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
    save() {
      if (this.key <=0){
        let that = this;
        console.log('在' + that.$store.state.mdid);
        this.$axios({
          method: 'post',
          url: '/savemd/',
          data: qs.stringify({
            mdid: that.$store.state.mdid,
            content: that.value
          })
        })
            .then(res => {
              switch (res.data.errornumber) {
                case 0:
                  this.$message.success("已保存");
                  break;
              }
            })
      }else{
        let that = this;
        this.$axios({
          method: 'post',
          url: '/savetext/',
          data: qs.stringify({
            docid: that.$store.state.docid,
            content: that.value
          })
        })
            .then(res => {
              switch (res.data.errornumber) {
                case 0:
                  this.$message.success("已保存");
                  break;
              }
            })
      }
    },
    addDoc() {/*只添加隶属于项目的文件*/
      this.$prompt('请输入文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let that = this;
        this.$axios({
          method: 'post',
          url: '/newmd/',
          data: qs.stringify({
            teamid: that.$store.state.teamid,
            name: value
          })
        })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:
                this.$message.success("已新建MarkDown文档:" + value);
                //this.$router.push('/manageTeam');
                this.reload();
                this.$message.success('dddddd');
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
      //console.log(key);
      let docid = undefined;
      let k = parseInt(key);
      this.key=k;
      if (k <= 0) { //说明选了md文件
        docid = this.mdidlist[-1 * k];
        this.$store.state.mdid = docid;
        console.log('选了md文件');
        this.showMarkDown();
        this.getMd();
      } else if (k >= 10) { //选了其他文件
        let a = k % 10;
        let b = Math.floor(k / 10);
        docid = this.docidlist[b - 1][a];
        this.$store.state.docid = docid;
        console.log('选了项目文件'+docid);
        this.getText();
      } else { //选了文件夹
        console.log('选了文件夹');
        this.showEmpty();
      }
    },
    getMd() {/*获取md*/
      let that = this;
      this.$axios({
        method: 'post',
        url: '/getmd/',
        data: qs.stringify({
          mdid: that.$store.state.mdid
        })
      })
        .then(res => {
          switch (res.data.errornumber) {
            case 0:
              if (res.data.content === null) {
                that.value = '立刻写入内容！';
                return;
              }
              that.value = res.data.content;
              console.log(res.data.content);
              console.log('成功获取');
              break;
          }
        })
    },
    getText() { /*获取隶属于项目的文档的文本 */
      let that = this;
      this.$axios({
        method: 'post',
        url: '/gettext/',
        data: qs.stringify({
          docid: that.$store.state.docid
        })
      })
        .then(res => {
          switch (res.data.errornumber) {
            case 0:
              this.value = res.data.content;
              if(this.value===null){
                this.value='尚未写入内容';
              }
              if (res.data.texttype==='d') {
                console.log('是word');
                this.showWord();
              } else {
                console.log('是md');
                this.showMarkDown();
              }
              break;
            case 1:
              break;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
  },
  mounted() {
    let that = this;
    console.log('初始化3');
    this.$axios({
      method: 'post',
      url: '/getlistbyteam/',
      data: qs.stringify({
        teamid: that.$store.state.teamid
      })
    })
      .then(res => {
        switch (res.data.errornumber) {
          case 0:
            console.log('初始化');
            console.log(res.data.folderlist);
            console.log(res.data.filelist);
            console.log(res.data.docidlist);
            this.folderlist = res.data.folderlist;
            this.filelist = res.data.filelist;
            this.docidlist = res.data.docidlist;
            this.mdlist = res.data.mdlist;
            this.mdidlist = res.data.mdidlist;
            break;
        }
      })
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

.folder {
  color: #093f86;
}
.file1{
  color: royalblue;
}
file2{
  color: indigo;
}
</style>
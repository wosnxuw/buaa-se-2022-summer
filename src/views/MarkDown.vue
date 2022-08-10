<template>
  <div id="app">
    <div id="editor-main">
      <le-editor v-model="value" :hljs-css="hljsCss" :image-uploader="imageUploader" @save="save"></le-editor>
    </div>
  </div>
</template>

<script>
import qs from "qs";

export default {
  // ...
  name:'MarkDown',
  data() {
    return {
      hljsCss: 'agate',
      value: '这里放markdown内容',
      // 自定义
      imageUploader: {
        custom: false,
        fileType: 'file',
        fileNameType: '',
        imagePrefix: 'http://106.54.92.121', // 图片上传成功后，预览地址前缀
        type: 'server',
        url: 'http://106.54.92.121:82/upload' // 上传接口地址
      }
    }
  },
  methods: {
    // 自定义图片上传
    // uploadImg: function ($vm, file, fileName) {
    //   console.log($vm)
    //   console.log(file)
    //   console.log(fileName)
    //   // 添加图片
    //   // 两个参数 第一个是图片访问路径 第二个是文件名
    //   $vm.insertImg(`${$vm.config.imageUploader.imagePrefix}${fileName}`, fileName)
    // },
    save () {
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
  mounted() {
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
              break;
            case 1:
              break;
          }
        })
        .catch(err => {
          console.log(err);
        })
  }
}
</script>

<style scoped>
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
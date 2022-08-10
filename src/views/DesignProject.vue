<template>
  <div class="main-box">
    <div class="nav-left">
      <div class="button-menu">
        <button class="back" @click="back">返回</button>
        <button class="output">导出</button>
        <!--button class="save">保存</button-->
      </div>
      <div class="element-menu">
        <div class="element-title">元素</div>
        <div class="element-box"></div>
      </div>
    </div>
    <div class="main-content" id="main-canvas" ref = 'ccc'>

    </div>
    <div class="component-right">
      <button id="rectangle" class="element" draggable="true">矩形</button>
      <button id="text" class="element">文字</button>
      <button id="line" class="element">线条</button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  methods:{
    // DownLoadImg(content){
    //                 // 格式
    //                 var imageType='png';
    //                 // 文件名
    //                 var fileName=Date.now();
    //                 var raw = window.atob(content);
    //                 var rawLength = raw.length;
    //                 var uInt8Array = new Uint8Array(rawLength);
    //                 for(var i = 0; i < rawLength; ++i) {
    //                     uInt8Array[i] = raw.charCodeAt(i);
    //                 }
    //                 var blob = new Blob([uInt8Array], {type:'image/'+imageType});
    //                 var aLink = document.createElement('a');
    //                 var evt = document.createEvent("HTMLEvents");
    //                 evt.initEvent("click", true, true);
    //                 aLink.download = fileName;
    //                 aLink.href = URL.createObjectURL(blob);
    //                 aLink.click();
    //             },
    back(){
      this.$router.push('/project');
    },
    init(){
      var wid = prompt("指定宽度:");
      var hei = prompt("指定高度:");
      var o = document.getElementsByClassName('main-content')[0]; // 主要文本框
      // var t = document.querySelector('.element-box');   // 左下角元素框
      var recb = document.getElementById('rectangle');  // 矩形
      var textb = document.getElementById('text');      // 文本
      var lineb = document.getElementById('line');      // 线条
      var output = document.getElementsByClassName('output')[0]; // 导出

      var element_array = [];

      var mouseType = 0;

      // console.log(wid);
      // console.log(hei);
      // 加入画布（类似）
      var d = document.createElement("div");

      d.setAttribute('class', 'center-style');
      d.style = "margin: 50px auto;background-color: white;border: 1px solid rgba(0, 0, 0, .7);position: relative;"
      d.style.width = wid + 'px';
      d.style.height = hei + 'px';
      o.appendChild(d);

      d.addEventListener('click', function(e){
        if (mouseType != 0){
          if (e.target == d && mouseType == 1){
            var w = prompt('宽度:');
            var h = prompt('高度:');
            var x = e.pageX;
            var y = e.pageY;
            var comp = document.createElement("div");
            // comp.setAttribute('class', 'node');
            comp.style = 'position: absolute;border: 1px solid rgba(0, 0, 0, .7);'
            comp.style.width = w + 'px';
            comp.style.height = h + 'px';
            comp.style.left = x - d.offsetLeft + 'px';
            comp.style.top = y - d.offsetTop + 'px';
            // console.log(x + ' ' + y + ' ' + d.offsetLeft + ' ' + d.offsetHeight);
            d.appendChild(comp);
            mouseType = 0;
            recb.setAttribute('class', 'element');

          }else if (e.target == d && mouseType == 2){
            var w2 = prompt('宽度:');
            var h2 = prompt('高度:');
            var x2 = e.pageX;
            var y2 = e.pageY;
            var comp2 = document.createElement("div");
            var tet = document.createElement('textarea');
            comp2.style = 'position: absolute;'
            comp2.appendChild(tet);
            comp2.style.width = w2 + 'px';
            comp2.style.height = h2 + 'px';
            comp2.style.left = x2 - d.offsetLeft + 'px';
            comp2.style.top = y2 - d.offsetTop + 'px';
            d.appendChild(comp2);
            mouseType = 0;
            textb.setAttribute('class', 'element');

          }else if (e.target == d && mouseType == 3){
            var l = prompt('长度:');
            var int_l = parseInt(l);
            var x3 = e.pageX;
            var y3 = e.pageY;
            var comp3 = document.createElement("div");
            comp3.style = 'position: absolute;border: 1px solid rgba(0, 0, 0, .7); height:1px; background-color:black;'
            comp3.style.width = l + 'px';
            var tl = document.createElement('path');
            comp3.appendChild(tl);
            comp3.style.left = x3 - d.offsetLeft + 'px';
            comp3.style.top = y3 - d.offsetTop + 'px';
            tl.setAttribute('d', 'M 0 0.5 L ' + int_l + ' 0.5');
            tl.setAttribute('stroke', 'rgba(0, 0, 0, 1)');
            tl.setAttribute('stroke-width', '1px');
            d.appendChild(comp3);
            mouseType = 0
            lineb.setAttribute('class', 'element');
          }
          // element_array[element_array.length] = comp;
          console.log(element_array);
        }else{
          return;
        }
      })
      // 添加方框
      recb.addEventListener('click', () => {
        recb.setAttribute('class', 'element chosen');
        textb.setAttribute('class', 'element');
        lineb.setAttribute('class', 'element');
        mouseType = 1;
      })

      // recb.addEventListener('mousedown', () => {
      //     recb.setAttribute('class', 'element chosen');
      //     textb.setAttribute('class', 'element');
      //     mouseType = 1;

      //     // var temp = document.createElement("div");
      //     // var temp_img = document.createElement('img');
      //     // temp.appendChild(temp_img);

      // })

      // 添加文本
      textb.addEventListener('click', () => {
        recb.setAttribute('class', 'element');
        textb.setAttribute('class', 'element chosen');
        mouseType = 2;
      })

      // line
      lineb.addEventListener('click', () => {
        recb.setAttribute('class', 'element');
        textb.setAttribute('class', 'element');
        lineb.setAttribute('class', 'element chosen');
        mouseType = 3;
      })

      // 待完成
      // function linkelement(eid, name){
      //     var newe = document.createElement()
      // }

      // 导出图片
      output.addEventListener('click', ()=>{
        console.log('1');
        const ref = this.$refs.ccc // 截图区域
        html2canvas(ref, {

          backgroundColor: '#e8f4ff',
          useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
        }).then((canvas) => {
          const dataURL = canvas.toDataURL('image/png')
          const creatDom = document.createElement('a')
          document.body.appendChild(creatDom)
          creatDom.href = dataURL
          creatDom.download = '图片'
          creatDom.click()
        })
        // html2canvas(document.querySelector('#main-canvas'),{
        //     onrendered: function(canvas){
        //         var dataUrl=canvas.toDataURL("image/jpeg", 1.0);
        //         console.log('2');
        //         var imageType='png';
        //         // 文件名
        //         var fileName=Date.now();
        //         var raw = window.atob(dataUrl.replace("data:image/jpeg;base64,", ""));
        //         var rawLength = raw.length;
        //         var uInt8Array = new Uint8Array(rawLength);
        //         for(var i = 0; i < rawLength; ++i) {
        //             uInt8Array[i] = raw.charCodeAt(i);
        //         }
        //         var blob = new Blob([uInt8Array], {type:'image/'+imageType});
        //         var aLink = document.createElement('a');
        //         var evt = document.createEvent("HTMLEvents");
        //         evt.initEvent("click", true, true);
        //         aLink.download = fileName;
        //         aLink.href = URL.createObjectURL(blob);
        //         aLink.click();


        //         // this.DownLoadImg(dataUrl.replace("data:image/jpeg;base64,", ""))
        //     }
        // })
      })





    }
  },
  mounted(){
    this.init();
  }
}
</script>

<style scoped>
#rectangle,#text,#line{
  width: 200px;
  height: 30px;
  display: block;
  font-size: 16px;
  line-height: 30px;
  margin-top: 23px;
  margin-left: 19px;
}
.main-box {
  width: 1200px;
  height: 500px;
  /* background-color: skyblue; */
  margin: 20px auto;
}
.nav-left {
  float: left;
  width: 200px;
  height: 500px;
  background-color: pink;
}
.main-content {
  float: left;
  width: 700px;
  height:500px;
  background-color: rgba(128 , 128, 128, .3);
  overflow: auto;
}
.component-right {
  float: left;
  width: 300px;
  height:500px;
  background-color: skyblue;
}
.button-menu {
  width: 200px;
  height: 300px;
  background-color: skyblue;
}
.element-menu {
  width: 200px;
  height: 200px;
  background-color: gray;
  overflow: auto;
}
.back, .output, .save{
  width: 180px;
  height: 30px;
  margin-top: 15px;
  margin-left: 10px;
}

.element-title {
  /* float: left; */
  height: 20px;
  padding-left: 20px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  font-size: 15px;
  line-height: 20px;
  background-color: skyblue;
}

.element-box {
  height: 177px;
  background-color: skyblue;
}

.center-style {
  margin: 50px auto;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, .7);
  position: relative;
}

.chosen {
  background-color: rgba(0, 0, 0, .7);
  color: white;
}
</style>
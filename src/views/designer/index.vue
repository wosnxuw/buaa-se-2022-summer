<template>
  <div>
    <el-row class="top">
      <el-col :span="2" align="right" style="height: 100%;overflow: hidden;">
        <!-- <el-image style="width: 40px; height: 40px;padding: 0;margin: 0" :src="require('/src/assets/logo.png')"
                  fit="fill"/> -->
      </el-col>
      <el-col :span="6">
        <span style="font-size:30px">墨 书</span>       
      </el-col>
      <el-col :span="16" @click.self.native="outBlur">
        <el-button size="mini" @click="back" style="margin: 10px 5px;background: #d5d9e2;float: right">返回</el-button>
        <el-button size="mini" @click="preview" style="margin: 10px 10px;
            background: #49586e;color: #fff;float: right">预览</el-button>
        <el-button size="mini" @click="submitDesign" style="margin: 10px 5px;background: #d5d9e2;float: right">保存</el-button>
        <div style="float: right;margin: 1px 10px;" class="configBtn" @click="clearDesign">
          <i style="font-size: 22px;" class="el-icon-delete"/>
        </div>
        <div style="float: right;margin: 0 10px;">
          <el-dropdown @command="exportCommand">
            <span class="el-dropdown-link">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="img">图片</el-dropdown-item>
              <el-dropdown-item command="json">设计文件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="float: right;margin: 0 10px;" @click="importDesign()">
          <span style="font-size: 14px;cursor: pointer">导入</span>
        </div>
<!-- 模板选择 -->
        <div style="float: right;margin: 0 10px;">
          <el-dropdown @command="useMoudle">
            <span class="el-dropdown-link">
              模板选择<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="mo1">学术交流</el-dropdown-item>
              <el-dropdown-item command="mo2">线上商城</el-dropdown-item>
              <el-dropdown-item command="mo3">图文信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>


      </el-col>
    </el-row>
    <div :style="{height: (windowHeight-45)+'px',background: 'url('+require('@/assets/port.png')+') repeat'}" @click.self="outBlur">
      <div style="float: left;height: 100%;overflow: hidden;" :style="{width:cptBarWidth+'px'}">
        <component-bar @dragStart="dragStart" :selectedComponents="cacheComponents" :currentCptIndex="currentCptIndex"
                       @showConfigBar="showConfigBar" @copyCpt="copyCpt" @delCpt="delCpt"/><!--左侧组件栏-->
      </div>
      <div style="float: left;position: relative;overflow: hidden;height: 100%" :style="{width:(windowWidth-cptBarWidth-configBarWidth)+'px'}" @click.self="outBlur">
        <div style="height: 10px;margin-left: 10px" :style="{width:1920*containerScale+'px'}">
          <ScaleMarkX/><!--顶部刻度线-->
        </div>
        <div style="position: absolute;width: 10px;" :style="{height:1920*containerScale / designData.scaleX * designData.scaleY+'px'}">
          <ScaleMarkY/><!--左侧刻度线-->
        </div>
        <div class="webContainer" :style="{width:designData.scaleX+'px',height: designData.scaleY+'px', backgroundColor: designData.bgColor,
             backgroundImage: designData.bgImg ? 'url('+fileUrl+designData.bgImg+')':'none',transform: 'scale('+containerScale+')' }"
             @dragover="allowDrop" @drop="drop" ref="webContainer"  @click.self="outBlur">
          <div v-for="(item,index) in cacheComponents" :key="item.keyId"
               class="cptDiv" :style="{width:Math.round(item.cptWidth)+'px', height:Math.round(item.cptHeight)+'px',
                  top:Math.round(item.cptY)+'px',left:Math.round(item.cptX)+'px',
                  zIndex: currentCptIndex === index ? 1800 : item.cptZ}" :ref="'div'+item.cptName+index"
               @mousedown="showConfigBar($event,item,index)" tabindex="0">
            <div v-show="currentCptIndex === index" style="position: fixed;border-top: 1px dashed #8A8A8A;width: 100%;left:0"/><!--顶部辅助线-->
            <div v-show="currentCptIndex === index" style="position: fixed;border-right: 1px dashed #8A8A8A;height:100%;top:0"/><!--左侧辅助线-->
            <!-- 2021-12-28新增iframe组件，防止焦点聚焦在iframe内部，添加此蒙版 -->
            <div v-resize="'move'" class="activeMask" :style="cacheChoices[item.keyId] ? {border:'1px solid #B6BFCE'}:{}"/>
            <div style="width: 100%;height: 100%;">
              <comment :is="item.cptName" :ref="item.cptName+index" :width="Math.round(item.cptWidth)"
                       :height="Math.round(item.cptHeight)" :option="item.option"/>
            </div>
            <div class="delTag">
              <i class="el-icon-copy-document" @click.stop="copyCpt(item)"/>
              <i style="margin-left: 4px" class="el-icon-delete" @click.stop="delCpt(item,index)"/>
            </div>
            <div v-show="currentCptIndex === index" style="top: 0;left: 0;cursor: se-resize;transform: translate(-50%, -50%)"
                 class="resizeTag" v-resize="'lt'"  />
            <div v-show="currentCptIndex === index" style="top: 0;left: 50%;cursor: s-resize;transform: translate(-50%, -50%)"
                 class="resizeTag" v-resize="'t'"  />
            <div v-show="currentCptIndex === index" style="top: 0;right: 0;cursor: ne-resize;transform: translate(50%, -50%)"
                 class="resizeTag" v-resize="'rt'"  />
            <div v-show="currentCptIndex === index" style="top: 50%;right: 0;cursor: w-resize;transform: translate(50%, -50%)"
                 class="resizeTag" v-resize="'r'"  />
            <div v-show="currentCptIndex === index" style="bottom: 0;right: 0;cursor: se-resize;transform: translate(50%, 50%)"
                 class="resizeTag" v-resize="'rb'"  />
            <div v-show="currentCptIndex === index" style="bottom: 0;left: 50%;cursor: s-resize;transform: translate(-50%, 50%)"
                 class="resizeTag" v-resize="'b'"  />
            <div v-show="currentCptIndex === index" style="bottom: 0;left: 0;cursor: ne-resize;transform: translate(-50%, 50%)"
                 class="resizeTag" v-resize="'lb'"  />
            <div v-show="currentCptIndex === index" style="top: 50%;left: 0;cursor: w-resize;transform: translate(-50%, -50%)"
                 class="resizeTag" v-resize="'l'"  />
          </div>
        </div>
        <div style="position: absolute;width: 120px;height: 30px;bottom: 10px;left: 10px;">
          <el-slider v-model="containerScale" :min="0.3" :max="2" :step="0.01"/>
        </div>
      </div>
      <div style="float: right;height: 100%;overflow: hidden" :style="{width:configBarWidth-6+'px'}">
        <config-bar ref="configBar" :currentCpt.sync="currentCpt" :designData.sync="designData" @refreshCptData="refreshCptData" :height="windowHeight"/><!--右侧属性栏-->
      </div>
    </div>
    <input v-show="false" type="file" id="files" ref="refFile" @change="fileLoad" accept=".cd">
  </div>
</template>

<script>
import qs from "qs"
import ComponentBar from "@/views/designer/componentBar";
import ConfigBar from "@/views/designer/configBar";
import cptOptions from "@/components/options"
import html2canvas from 'html2canvas';
import {fileDownload, base64toFile} from '@/utils/FileUtil'
import env from "/env";
import {saveOrUpdateApi,uploadFileApi} from "@/api/DesignerApi";
import {clearCptInterval} from "@/utils/refreshCptData";
import ScaleMarkX from "@/views/designer/scaleMark/ScaleMarkX";
import ScaleMarkY from "@/views/designer/scaleMark/ScaleMarkY";

export default {
  name: 'design-index',
  components: {ScaleMarkY, ScaleMarkX, ConfigBar, ComponentBar},
  data() {
    return {
      windowWidth:0,
      windowHeight:0,
      fileUrl:env.fileUrl,
      cptBarWidth:200,
      configBarWidth:300,
      copyDom: '',
      designData:{
        id:'',title:'我的大屏', scaleX:1920, scaleY:1080, version:'',
        bgColor:'#2B3340',simpleDesc:'',bgImg:'',viewCode:'',components:[]
      },
      cacheComponents:[],
      currentCptIndex: -1,
      currentCpt: {option: undefined},
      containerScale:1,
      cacheChoices:{},
      cacheChoicesFixed:{}//记录移动前选中组件的位置 自定义事件内部无法处理，放在了外面。
    }
  },
  created() {
    this.loadCacheData();
  },
  mounted() {
    const that = this;
    window.addEventListener("keydown",(event)=>{
      if (that.currentCptIndex !== -1){
        let key = event.key
        switch (key) {//方向键移动当前组件
          case 'ArrowDown':
            that.currentCpt.cptY += 1;
            break;
          case 'ArrowUp':
            that.currentCpt.cptY -= 1;
            break;
          case 'ArrowLeft':
            that.currentCpt.cptX -= 1
            break;
          case 'ArrowRight':
            that.currentCpt.cptX += 1
            break;
        }
      }
    })
    window.onresize = () => {
      return (() => {
        that.initContainerSize()
      })();
    };
  },
  methods: {
    back(){
      this.$router.push('/draw');
    },
    initContainerSize(){
      this.windowWidth = document.documentElement.clientWidth
      this.windowHeight = document.documentElement.clientHeight
      let tempWidth = this.windowWidth - this.cptBarWidth - this.configBarWidth;
      this.containerScale = Math.round(tempWidth / this.designData.scaleX * 100) / 100
    },
    exportCommand(command) {
      if(command === 'img'){
        html2canvas(this.$refs.webContainer, {backgroundColor: '#49586e'}).then(canvas => {
          const canvasData = canvas.toDataURL("image/jpeg");
          fileDownload(canvasData,this.designData.title+'.png');
        })
      }else if(command === 'json'){
        this.designData.components = this.cacheComponents;
        this.designData.version = env.version;
        const data = JSON.stringify(this.designData)
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);//encodeURIComponent解决中文乱码
        fileDownload(uri,this.designData.title+'.cd');
      }
    },
    useMoudle(command){ 
      //console.log(command);
//#region 
      var m1 = '{"id":"","title":"学术展示","scaleX":1920,"scaleY":1080,"version":"1.8.9","bgColor":"#2B3340","simpleDesc":"这是一个“学术展示”模板。","bgImg":"","viewCode":"","components":[{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"普通文本\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"rgba(0, 0, 0, 1)","textSize":50,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"center","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":652,"cptY":80,"cptWidth":346,"cptHeight":76,"keyId":"c8689fb0-1791-11ed-b8f2-1b9c8e9ccce6"},{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"在此编辑在此编辑文本\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"rgba(215, 224, 214, 1)","textSize":30,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"center","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":176,"cptY":268,"cptWidth":272,"cptHeight":451,"keyId":"ffbda9b0-1791-11ed-9f2e-2b74cecd932a"},{"groupTag":"chart","cptTitle":"柱状图","icon":"column","cptName":"cpt-chart-column","cptZ":100,"option":{"attribute":{"chartTitle":"标题一","titleLeft":"center","titleTop":10,"titleTextColor":"#ccc","xAxisShow":true,"yAxisShow":true,"xLineShow":true,"yLineShow":true,"xLabelColor":"#ccc","xLineColor":"#ccc","yLabelColor":"#0bd124","yLineColor":"#ccc","yGridLineShow":false,"yTickShow":true,"xTickShow":true,"barBgShow":false,"barBorderRadius":5,"barLabelShow":true,"barLabelColor":"#ff0","barLabelSize":10,"gradualColor":true,"barColor":"#409eff","barColor1":"#e9a90a","barColor2":"#0bcfcf","barColor3":"#cc0ce6","barWidth":18,"barType":"bar","xFontRotate":0,"barPath":"path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z"},"cptDataForm":{"dataText":"{\\"xData\\":\\"Mon,Tue,Wed,Thu,Fri,Sat,Sun\\",\\"yData\\":\\"120,200,150,80,70,110,130\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"}},"cptX":1133,"cptY":657,"cptWidth":400,"cptHeight":300,"keyId":"b606dac0-1792-11ed-9f2e-2b74cecd932a"},{"groupTag":"chart","cptTitle":"折线图","icon":"line","cptName":"cpt-chart-line","cptZ":100,"option":{"cptDataForm":{"dataSource":1,"pollTime":0,"dataText":"{\\"xData\\":\\"Mon,Tue,Wed,Thu,Fri,Sat,Sun\\",\\"yData\\":\\"120,200,150,80,70,110,130\\"}","apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"title":"一天用电量分布","subtext":"纯属虚构","titleLeft":"center","titleTop":10,"subtextColor":"#aaa","yTickShow":true,"yGridLineShow":false,"xLineShow":true,"yLineShow":true,"xTickShow":true,"xLabelShow":true,"yLabelShow":true,"lineColor":"#409eff","xLabelColor":"#eee","xLineColor":"#eee","titleTextColor":"#ccc","yLabelColor":"#eee","yLineColor":"#eee","smooth":false,"areaColor1":"rgba(80,141,255,0.39)","areaColor2":"rgba(56,155,255,0.25)","areaColor3":"rgba(38,197,254,0.00)"}},"cptX":1116,"cptY":248,"cptWidth":400,"cptHeight":300,"keyId":"bbee8af0-1792-11ed-9f2e-2b74cecd932a"}]}'
      var m2 = '{"id":"","title":"线上商城","scaleX":1920,"scaleY":1080,"version":"1.8.9","bgColor":"#2B3340","simpleDesc":"这是一个“线上商城”模板。","bgImg":"","viewCode":"","components":[{"groupTag":"basic","cptTitle":"轮播图","icon":"carousel","cptName":"cpt-carousel","cptZ":100,"option":{"attribute":{"trigger":"hover","fit":"cover","imgUrls":["blob:http://localhost:8009/fc2acc6c-0938-4083-a831-134bf29198da","blob:http://localhost:8009/7dff2e04-5809-45d4-9543-7d983eac5274"]}},"cptX":308,"cptY":44,"cptWidth":1245,"cptHeight":329,"keyId":"02a66a60-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"iframe","icon":"iframe","cptName":"cpt-iframe","cptZ":100,"option":{"attribute":{"url":"https://img0.baidu.com/it/u=1316107336,2058486850&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1"}},"cptX":194,"cptY":447,"cptWidth":285,"cptHeight":335,"keyId":"280b5270-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"iframe","icon":"iframe","cptName":"cpt-iframe","cptZ":100,"option":{"attribute":{"url":"https://img0.baidu.com/it/u=1316107336,2058486850&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1"}},"cptX":598,"cptY":445,"cptWidth":285,"cptHeight":335,"keyId":"5aafa5a0-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"iframe","icon":"iframe","cptName":"cpt-iframe","cptZ":100,"option":{"attribute":{"url":"https://img0.baidu.com/it/u=1316107336,2058486850&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1"}},"cptX":1017,"cptY":442,"cptWidth":285,"cptHeight":335,"keyId":"5e3faa30-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"iframe","icon":"iframe","cptName":"cpt-iframe","cptZ":100,"option":{"attribute":{"url":"https://img0.baidu.com/it/u=1316107336,2058486850&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1"}},"cptX":1434,"cptY":441,"cptWidth":285,"cptHeight":335,"keyId":"61541620-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"一\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"#4BB344","textSize":16,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"center","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":201,"cptY":811,"cptWidth":269,"cptHeight":123,"keyId":"b7150f10-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"二\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"#4BB344","textSize":16,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"center","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":600,"cptY":808,"cptWidth":269,"cptHeight":123,"keyId":"bc697ff0-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"三\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"#4BB344","textSize":16,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"center","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":1017,"cptY":818,"cptWidth":269,"cptHeight":123,"keyId":"c1b0d170-1795-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"四\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"#4BB344","textSize":16,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"center","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":1436,"cptY":804,"cptWidth":269,"cptHeight":123,"keyId":"c70eb830-1795-11ed-9f78-59aa0bb32f96"}]}'
      var m3 = '{"id":"","title":"图文信息","scaleX":1920,"scaleY":1080,"version":"1.8.9","bgColor":"rgba(38, 42, 48, 1)","simpleDesc":"这是一个“图文信息”模板。","bgImg":"","viewCode":"","components":[{"groupTag":"basic","cptTitle":"iframe","icon":"iframe","cptName":"cpt-iframe","cptZ":100,"option":{"attribute":{"url":"https://www.rainy.pub/"}},"cptX":122,"cptY":15,"cptWidth":1695,"cptHeight":220,"keyId":"fb6d9a60-179a-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"轮播图","icon":"carousel","cptName":"cpt-carousel","cptZ":100,"option":{"attribute":{"trigger":"hover","fit":"cover","imgUrls":["blob:http://localhost:8009/67f035f1-dca5-4b0b-9a67-30521c49da0f"]}},"cptX":1333,"cptY":291,"cptWidth":476,"cptHeight":324,"keyId":"0a096130-179b-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"普通文本\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"#4BB344","textSize":16,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"left","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":135,"cptY":282,"cptWidth":1154,"cptHeight":327,"keyId":"144d66a0-179b-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"轮播图","icon":"carousel","cptName":"cpt-carousel","cptZ":100,"option":{"attribute":{"trigger":"hover","fit":"cover","imgUrls":["blob:http://localhost:8009/67f035f1-dca5-4b0b-9a67-30521c49da0f"]}},"cptX":1332,"cptY":690,"cptWidth":476,"cptHeight":324,"keyId":"31dfbe70-179b-11ed-9f78-59aa0bb32f96"},{"groupTag":"basic","cptTitle":"文字框","icon":"text","cptName":"cpt-text","cptZ":100,"option":{"cptDataForm":{"dataText":"{\\"value\\":\\"普通文本\\"}","dataSource":1,"pollTime":0,"apiUrl":"/design/test","sql":"select username from sys_user limit 1"},"attribute":{"url":"","textColor":"#4BB344","textSize":16,"fontWeight":"normal","textLineHeight":30,"textFamily":"微软雅黑","textAlign":"left","fontStyle":"normal","textDecoration":"none","bgColor":"rgba(255, 255, 255, 0)"}},"cptX":139,"cptY":692,"cptWidth":1154,"cptHeight":327,"keyId":"6f4f6f80-179b-11ed-9f78-59aa0bb32f96"}]}'
//#endregion
      if (command === 'mo1'){
        this.designData = JSON.parse(m1);
        this.cacheComponents = this.designData.components;
        this.designData.components = [];
        this.designData.version = env.version;
        this.initContainerSize();
      }else if (command === 'mo2'){
        this.designData = JSON.parse(m2);
        this.cacheComponents = this.designData.components;
        this.designData.components = [];
        this.designData.version = env.version;
        this.initContainerSize();
      }else if (command === 'mo3'){
        this.designData = JSON.parse(m3);
        this.cacheComponents = this.designData.components;
        this.designData.components = [];
        this.designData.version = env.version;
        this.initContainerSize();
      }
    },  
    importDesign(){
      this.$refs.refFile.dispatchEvent(new MouseEvent('click'))
    },

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    fileLoad(){
      const that = this;
      const selectedFile = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = function() {
        const fileJson = JSON.parse(this.result);//文件大小、合法性待校验
        if (!fileJson.version || fileJson.version !== env.version){
          that.$message.error('导入失败，与当前版本不一致');
        }else{
          that.designData = fileJson;
          that.cacheComponents = fileJson.components;
          that.designData.components = [];
          that.$message.success('导入成功');
        }
      }
      this.$refs.refFile.value =''
    },
    clearDesign(){
      this.$confirm('此操作将会清空图层，是否继续？', '警告', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        this.cacheComponents = [];
        this.designData.components = [];
        this.currentCpt = {};
        localStorage.removeItem('designCache');
        clearCptInterval(null, true);
        this.$message.success("清除成功");
      }).catch(() => {});
    },
    //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    loadCacheData(){
      const loading = this.$loading({
        lock: true, text: '加载中', spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      if ('preview' === env.active){

        // 于此处获得即可
        let did=this.$store.state.drawid;
        // let that=this;
        var openthing = '';
        this.$axios({
          url: '/opendesignprototype/',  // 我不知道路由
          method: 'post',
          data: qs.stringify({
            designprototypeid: did,
          })
        }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              openthing = res.data.designprototypecontent;
              //console.log(openthing);
              if(openthing===null){
                openthing='{"id":"","title":"","scaleX":1920,"scaleY":1080,"version":"1.8.9","bgColor":"#2B3340","simpleDesc":"","bgImg":"","viewCode":"","components":[]}';
              }
              this.designData = JSON.parse(openthing);
              this.cacheComponents = this.designData.components;
              this.designData.components = [];//强迫症
              this.designData.version = env.version;
              this.initContainerSize();
              break;
          }
        })

        // const cacheStr = localStorage.getItem('designCache');
        if (openthing){
          this.designData = JSON.parse(openthing);
          this.cacheComponents = this.designData.components;
          this.designData.components = [];//强迫症
          this.designData.version = env.version;
          this.initContainerSize();
          // if (!this.designData.version || this.designData.version !== env.version){
          //   localStorage.removeItem('designCache');
          //   this.$message.success("发现旧版缓存，已清除");
          // }else{
          //   this.cacheComponents = this.designData.components;
          //   this.designData.components = [];//强迫症
          // }
        }else{
          //console.log('打开时无文件读取到1');
        }
        // this.designData.version = env.version;
        // this.initContainerSize();
        loading.close();
      }else{
        //console.log('打开时无文件读取到2');
        // const id = this.$route.query.id;
        // if (id){
        //   getByIdApi(id,0).then(res => {
        //     this.designData = res.data;
        //     this.cacheComponents = JSON.parse(this.designData.components);
        //     if (!this.cacheComponents){
        //       this.cacheComponents = []
        //     }
        //     this.designData.components = [];
        //     this.initContainerSize();
        //     loading.close();
        //   })
        // }else{
        //   this.$message.error('当前为DEV模式，请从管理端进入')
        // }
      }
    },
    copyCpt(item){
      let copyItem = JSON.parse(JSON.stringify(item))
      copyItem.cptX = item.cptX+30//复制的组件向右下偏移
      copyItem.cptY = item.cptY+30
      copyItem.keyId = require('uuid').v1();
      this.cacheComponents.push(copyItem);
      this.currentCptIndex = this.cacheComponents.length - 1//聚焦到复制的组件
    },
    refreshCptData(){
      const refName = this.currentCpt.cptName + this.currentCptIndex;
      if(!this.$refs[refName][0].refreshCptData){
        this.$message.warning('当前图层还未实现refreshCptData方法')
      }else {
        this.$refs[refName][0].refreshCptData();//刷新子组件数据，refs为组建名加index
      }
    },
    outBlur(){//取消聚焦组件
      this.currentCptIndex = -1;
      this.currentCpt = {};
      this.cacheChoices = {}
    },
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    submitDesign() {//保存
      if ('preview'===env.active){
        this.designData.components = this.cacheComponents;
        //console.log(JSON.stringify(this.designData));
        // localStorage.setItem('designCache', JSON.stringify(this.designData));

        let designmessage = JSON.stringify(this.designData);
        //console.log(designmessage)
        let did = this.$store.state.drawid;
        //let that = this;
        this.$axios({
          url:'/updatedesignprototype/',  // 我不知道路由
          method:'post',
          data:qs.stringify({
            designprototypeid:did,
            designprototypecontent:designmessage
          })
        }).then(res=>{
          switch (res.data.errornumber) {
            case 0:
              //that.msg = res.data.msg;
              this.$message.success('已保存')
              break;
          }
        })
        // 写于此处

      }else {
        const that = this;
        if(!that.$route.query.id){
          that.$message.error('更新异常')
          return;
        }
        const loading = this.$loading({
          lock: true, text: '保存中', spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        html2canvas(that.$refs.webContainer, {backgroundColor: '#49586e'}).then(canvas => {
          const canvasData = canvas.toDataURL("image/jpeg");
          let file = base64toFile(canvasData,that.designData.title+'.png');
          let fileFormData = new FormData()
          fileFormData.append('file',file)
          uploadFileApi(that.designData.id+'.png',fileFormData).then(res => {//上传预览图
            that.designData.designImgPath = res.data
            that.designData.components = JSON.stringify(this.cacheComponents)
            saveOrUpdateApi(this.designData).then(res2 => {
              loading.close();
              that.$message.success(res2.msg);
            })
          })
          loading.close();
        })
      }
    },
    preview() {//预览按钮
      this.designData.components = this.cacheComponents;
      localStorage.setItem('designCache', JSON.stringify(this.designData));
      let routeUrl = this.$router.resolve({
        path: "/preview"
      });
      window.open(routeUrl.href, '_blank');
    },
    delCpt(cpt,index) {
      this.$confirm('删除'+cpt.cptTitle+'组件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //记录一个bug，v-for key值重复导致页面渲染数据错乱。在丢下组件时实用uuid作为key解决。
        this.currentCpt = {};
        this.cacheComponents.splice(index, 1);
        const childId = this.$refs[cpt.cptName+index][0].uuid
        clearCptInterval(childId);
      }).catch(() => {});
    },
    showConfigBar(e, item, index) {//刷新属性栏数据，页面上拖动的组件执行click事件来更新组件的属性栏
      this.currentCpt = item;
      this.currentCptIndex = index;
      if(this.$refs['div'+item.cptName+index]){
        this.$refs['div'+item.cptName+index][0].focus();//聚焦 用于多选移动
      }
      if(!e.ctrlKey){//未按住ctrl键
        this.cacheChoices = {}
      }
      this.$refs['configBar'].showCptConfig(item);
      this.cacheChoices[item.keyId]=item
      this.cacheChoicesFixed[item.keyId]=JSON.parse(JSON.stringify(item))
    },
    dragStart(copyDom) {//从组件栏拿起组件
      this.copyDom = copyDom;
      copyDom.draggable = false;
    },
    allowDrop(e) {e.preventDefault()},
    drop(e) {//从组件栏丢下组件
      let config = JSON.parse(this.copyDom.getAttribute('config'));
      let cpt = {
        groupTag: config.group, cptTitle:config.title, icon: config.icon,
        cptName: config.name, cptZ: 100, option: undefined,
        cptX: Math.round(e.offsetX),
        cptY: Math.round(e.offsetY),
        cptWidth: config.initWidth, cptHeight: config.initHeight,
        keyId: require('uuid').v1()
      }
      const group = cptOptions[config.group];
      if (group && group.options[config.name + '-option']) {
        const option = group.options[config.name + '-option']
        if(option.cptDataForm){//将静态数据、api、sql用三个字段存储，配置项未填写apiUrl字段和sql字段在此处赋默认值
          if (!option.cptDataForm.apiUrl){
            option.cptDataForm.apiUrl = '/design/test'
          }
          if(!option.cptDataForm.sql){
            option.cptDataForm.sql = 'select username from sys_user limit 1'
          }
        }
        cpt.option = JSON.parse(JSON.stringify(option))
      }else {
        this.$message.error("未再options.js中查找到"+config.group+"."+config.name+"-option的自定义属性")
        return;
      }
      this.cacheComponents.push(cpt);
      this.cacheChoices = {}//多选清空
      this.showConfigBar({}, cpt, this.cacheComponents.length - 1)//丢下组件后刷新组件属性栏
      this.$refs['configBar'].showCptConfig();
    },
  },
  directives: {
    resize(el, binding, vNode) {//组件拉伸，移动位置
      el.onmousedown = function (e) {
        const that = vNode.context;
        const scaleClientX = e.clientX / that.containerScale;
        const scaleClientY = e.clientY / that.containerScale;
        const rbX = scaleClientX - el.parentNode.offsetWidth;
        const rbY = scaleClientY - el.parentNode.offsetHeight;
        const ltX = scaleClientX + el.parentNode.offsetWidth;
        const ltY = scaleClientY + el.parentNode.offsetHeight;
        const disX = scaleClientX - el.parentNode.offsetLeft;
        const disY = scaleClientY - el.parentNode.offsetTop;
        let cptWidth, cptHeight, cptX, cptY;

        document.onmousemove = function (me) {
          const meScaleClientX = me.clientX/that.containerScale
          const meScaleClientY = me.clientY/that.containerScale
          if (binding.value === 'move'){
            cptX = meScaleClientX - disX;
            cptY = meScaleClientY - disY;
            Object.keys(that.cacheChoices).forEach((key)=>{
              that.cacheChoices[key].cptX = that.cacheChoicesFixed[key].cptX + Math.round(meScaleClientX-scaleClientX)
              that.cacheChoices[key].cptY = that.cacheChoicesFixed[key].cptY + Math.round(meScaleClientY-scaleClientY)
            })
          }else{
            switch (binding.value) {
              case 'lt':
                cptWidth = ltX - meScaleClientX;
                cptHeight = ltY - meScaleClientY;
                cptX = meScaleClientX - disX;
                cptY = meScaleClientY - disY;
                that.currentCpt.cptX = Math.round(cptX);
                that.currentCpt.cptY = Math.round(cptY);
                break;
              case 't':
                cptHeight = ltY - meScaleClientY;
                cptY = meScaleClientY - disY;
                that.currentCpt.cptY = Math.round(cptY);
                break;
              case 'rt':
                cptWidth = meScaleClientX - rbX;
                cptHeight = ltY - meScaleClientY;
                cptY = meScaleClientY - disY;
                that.currentCpt.cptY = Math.round(cptY);
                break;
              case 'r':
                cptWidth = meScaleClientX - rbX;
                break;
              case 'rb':
                cptWidth = meScaleClientX - rbX;
                cptHeight = meScaleClientY - rbY;
                break;
              case 'b':
                cptHeight = meScaleClientY - rbY;
                break;
              case 'lb':
                cptWidth = ltX - meScaleClientX;
                cptHeight = meScaleClientY - rbY;
                cptX = meScaleClientX - disX;
                that.currentCpt.cptX = Math.round(cptX);
                break;
              case 'l':
                cptWidth = ltX - meScaleClientX;
                cptX = meScaleClientX - disX;
                that.currentCpt.cptX = Math.round(cptX);
                break;
            }
            cptWidth = cptWidth < 40 ? 40:cptWidth;//限制最小缩放
            cptHeight = cptHeight < 20 ? 20:cptHeight;
            if (cptWidth) that.currentCpt.cptWidth = Math.round(cptWidth);
            if (cptHeight) that.currentCpt.cptHeight = Math.round(cptHeight);
          }
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
          that.cacheChoicesFixed = JSON.parse(JSON.stringify(that.cacheChoices));//解决多选移动未松开ctrl键第二次以后拖动定位还原
        }
        return false;
      }
    }
  },
}
</script>

<style scoped>
.top {height: 45px;box-shadow: 0 2px 5px #2b3340 inset;color: #fff;overflow: hidden;
  margin: 0;font-size: 18px;line-height: 45px;background: #353F50}
.webContainer {position: relative;margin: 0 10px;background-size:100% 100%;transform-origin:0 0}
.delTag {width: 45px;height: 22px;background: rgba(43, 51, 64, 0.8);border-radius: 2px;color: #ccc;z-index: 2000;
  position: absolute;top: 0;right: 0;text-align: center;display: none;cursor: pointer
}
.activeMask{width: 100%;height: 100%;position: absolute;z-index: 1801}
.cptDiv{position: absolute;outline:none}
.cptDiv:hover .delTag {display: block}
.resizeTag{width: 8px;height: 8px;position: absolute;background-color: #B6BFCE;z-index: 2000;border-radius: 50%;}
.configBtn:hover{cursor: pointer;color: #B6BFCE}
.el-dropdown-link { cursor: pointer; color: #fff;}
</style>

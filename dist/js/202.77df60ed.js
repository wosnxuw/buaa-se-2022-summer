"use strict";(self["webpackChunkbuaa_se_2022_summer"]=self["webpackChunkbuaa_se_2022_summer"]||[]).push([[202],{202:function(t,e,r){r.r(e),r.d(e,{default:function(){return u}});var a=function(){var t=this,e=t._self._c;return e("el-container",[e("el-header",[e("el-menu",{staticClass:"el-menu-demo",attrs:{"default-active":t.activeIndex,mode:"horizontal","background-color":"#545c64","text-color":"#fff","active-text-color":"#ffd04b"}},[e("el-menu-item",{attrs:{index:"1"},on:{click:t.showproj}},[t._v("返回")]),e("el-menu-item",{attrs:{index:"2"}},[t._v("项目详情")])],1)],1),e("el-main",[e("el-row",{attrs:{gutter:40}},[e("el-col",{attrs:{span:12,offset:6}},[e("div",[e("el-card",{staticClass:"box-card",attrs:{shadow:"hover"}},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("span",[t._v(t._s(t.projname))])]),e("div",{staticClass:"text item"},[e("span",[t._v(t._s(t.projectdiscrp))])])]),e("el-button-group",[e("el-button",{attrs:{type:"primary"}},[e("a",{attrs:{href:"http://www.diagrams.net/",target:"_blank"}},[t._v("绘制 UML")])]),e("el-button",{attrs:{type:"primary"},on:{click:t.todraw}},[t._v("设计原型")]),e("el-button",{attrs:{type:"primary"},on:{click:t.todoc}},[t._v("编辑文档")])],1)],1)])],1)],1)],1)},s=[],o=r(5410),i=r.n(o),n={name:"ProjectInfo",data(){return{activeIndex:"2",projname:"测试",projectdiscrp:"城市水水水水水水水水水水水水水水"}},methods:{showproj:function(){this.$store.state.projectid=void 0,this.$router.push("/manageProject")},todraw(){this.$router.push("/design")},todoc(){this.$router.push("/documentEdit")}},mounted(){let t=this.$store.state.projectid,e=this;this.$axios({url:"/initialprojectinformation/",method:"post",data:i().stringify({projectid:t})}).then((t=>{switch(t.data.errornumber){case 0:e.projname=t.data.projectname,e.projectdiscrp=t.data.projectdescpt;break;case 1:this.$message.error("请求方式错误");break}}))}},c=n,d=r(1001),l=(0,d.Z)(c,a,s,!1,null,"eb8f3326",null),u=l.exports}}]);
//# sourceMappingURL=202.77df60ed.js.map
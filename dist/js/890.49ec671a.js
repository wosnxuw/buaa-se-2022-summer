"use strict";(self["webpackChunkbuaa_se_2022_summer"]=self["webpackChunkbuaa_se_2022_summer"]||[]).push([[890],{9890:function(e,t,s){s.r(t),s.d(t,{default:function(){return u}});var a=function(){var e=this,t=e._self._c;return t("div",{staticClass:"manage",attrs:{id:"manage"}},[t("el-container",[t("el-header",[t("el-menu",{staticClass:"el-menu-demo",attrs:{"default-active":e.activeIndex,mode:"horizontal","background-color":"#545c64","text-color":"#fff","active-text-color":"#ffd04b"}},[t("el-menu-item",{attrs:{index:"1"},on:{click:e.showproj}},[e._v("项目中心")]),t("el-menu-item",{attrs:{index:"2"},on:{click:e.showrubbish}},[e._v("回收站")]),t("el-menu-item",{attrs:{index:"3"},on:{click:e.showAdd}},[e._v("新建项目")]),t("el-menu-item",{attrs:{index:"4"},on:{click:e.toManageTeam}},[e._v("管理团队")]),t("el-menu-item",{attrs:{index:"5","text-color":"#eb5451"}},[t("el-button",{attrs:{type:"text"},on:{click:e.logout}},[e._v("退出登陆")])],1)],1)],1),t("el-container",[t("el-main",[t("el-row",[t("el-col",{attrs:{span:12,offset:6}},[t("div",[t("el-steps",{attrs:{active:e.step,"align-center":""}},[t("el-step",{attrs:{title:"输入项目名",description:"起一个名字吧"}}),t("el-step",{attrs:{title:"选择项目所属团队",description:"团队过多可以搜索寻找"}}),t("el-step",{attrs:{title:"输入项目简介",description:"为项目将要做什么撰写描述"}})],1)],1)]),t("el-col",{attrs:{span:8,offset:8}},[t("div",[t("el-form",{ref:"form",staticClass:"form",attrs:{model:e.form}},[t("el-form-item",{directives:[{name:"show",rawName:"v-show",value:e.a,expression:"a"}],attrs:{prop:"text"}},[t("el-input",{attrs:{placeholder:"项目名",type:"text",autocomplete:"off"},model:{value:e.form.projectname,callback:function(t){e.$set(e.form,"projectname",t)},expression:"form.projectname"}})],1),t("el-select",{directives:[{name:"show",rawName:"v-show",value:e.b,expression:"b"}],attrs:{filterable:"",placeholder:"请选择团队 或键入以搜索",id:"choose-team"},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}},e._l(e.options,(function(e){return t("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1),t("el-form-item",{directives:[{name:"show",rawName:"v-show",value:e.c,expression:"c"}],attrs:{prop:"text"}},[t("el-input",{attrs:{placeholder:"项目描述",autosize:"",clearable:"",type:"textarea",maxlength:"100","show-word-limit":"",autocomplete:"off"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.addproj.apply(null,arguments)}},model:{value:e.form.projectdiscrp,callback:function(t){e.$set(e.form,"projectdiscrp",t)},expression:"form.projectdiscrp"}})],1)],1)],1)]),t("el-col",{attrs:{span:8,offset:8}},[t("div",[t("el-button-group",{directives:[{name:"show",rawName:"v-show",value:e.a,expression:"a"}]},[t("el-button",{attrs:{type:"primary"},on:{click:e.toB}},[e._v("下一步")])],1),t("el-button-group",{directives:[{name:"show",rawName:"v-show",value:e.b,expression:"b"}]},[t("el-button",{attrs:{type:"primary"},on:{click:e.toA}},[e._v("上一步")]),t("el-button",{attrs:{type:"primary"},on:{click:e.toC}},[e._v("下一步")])],1),t("el-button-group",{directives:[{name:"show",rawName:"v-show",value:e.c,expression:"c"}]},[t("el-button",{attrs:{type:"primary"},on:{click:e.toB}},[e._v("上一步")]),t("el-button",{attrs:{type:"primary"},on:{click:e.addproj}},[e._v("完成")])],1)],1)])],1)],1)],1)],1)],1)},o=[],r=s(5410),i=s.n(r),n={name:"AddProject",data(){return{a:!0,b:!1,c:!1,step:1,teamlist:[],activeIndex:"3",form:{projectname:"",projectdiscrp:""},options:[],value:""}},methods:{toA(){this.step=1,this.b=this.c=!1,this.a=!0},toB(){this.step=2,this.a=this.c=!1,this.b=!0},toC(){this.step=3,this.b=this.a=!1,this.c=!0},toManageTeam(){this.$router.push("/manageTeam")},logout(){this.$confirm("您即将退出登陆, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((()=>{this.$message({type:"success",message:"退出成功!"}),this.$store.dispatch("clear"),this.$router.push("/login")})).catch((()=>{this.$message({type:"info",showClose:!0,message:"已放弃"})}))},showproj:function(){this.$router.push("/manageProject")},showrubbish:function(){this.$router.push("/manageRubbish")},showAdd:function(){},addproj:function(){this.$axios({method:"post",url:"/insertproject/",data:i().stringify({projectname:this.form.projectname,projectdiscrp:this.form.projectdiscrp,teamname:this.value})}).then((e=>{switch(e.data.errornumber){case 0:this.$message.success("新建项目成功！"),this.$router.push("/manageProject");break;case 1:this.$message.error("队伍名错误或不存在"),this.$router.push("/addProject");break}})).catch((e=>{console.log(e)}))}},mounted(){const e=this.$store.state.userid;let t=this;this.$axios({url:"/getteammember/",method:"post",data:i().stringify({now_id:e})}).then((e=>{switch(e.data.result){case 0:t.teamlist=e.data.team_list;var s=0;for(s=0;s<t.teamlist.length;s++)t.options.push({value:t.teamlist[s],label:t.teamlist[s]});break;case 1:this.$message.error("请求方式错误");break}}))}},l=n,c=s(1001),m=(0,c.Z)(l,a,o,!1,null,"69449876",null),u=m.exports}}]);
//# sourceMappingURL=890.49ec671a.js.map
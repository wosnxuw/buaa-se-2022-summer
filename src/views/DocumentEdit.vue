<template>
  <div>

    <div class="menu">
      <button id="back" @click="back">返回</button>
      <button id="new">新建</button>
      <button id="save">保存</button>
      <button id="delet">删除</button>
    </div>
    <div class="container">
      <div class="options">
        <button id="bold" class="option-button format">
          <i class="fa-solid fa-bold"></i>
        </button>

        <button id="italic" class="option-button format">
          <i class="fa-solid fa-italic"></i>
        </button>

        <button id="underline" class="option-button format">
          <i class="fa-solid fa-underline"></i>
        </button>

        <button id="strikethrough" class="option-button format">
          <i class="fa-solid fa-strikethrough"></i>
        </button>

        <button id="superscript" class="option-button script">
          <i class="fa-solid fa-superscript"></i>
        </button>

        <button id="subscript" class="option-button script">
          <i class="fa-solid fa-subscript"></i>
        </button>

        <button id="insertOrdererList" class="option-button">
          <div class="fa-solid fa-list-ol"></div>
        </button>

        <button id="insertUnorderedList" class="option-button">
          <i class="fa-solid fa-list"></i>
        </button>

        <button id="undo" class="option-button">
          <i class="fa-solid fa-rotate-left"></i>
        </button>

        <button id="redo" class="option-button">
          <i class="fa-solid fa-rotate-right"></i>
        </button>

        <button id="createLink" class="adv-option-button">
          <i class="fa fa-link"></i>
        </button>

        <button id="unlink" class="option-button">
          <i class="fa fa-unlink"></i>
        </button>

        <button id="justifyLeft" class="option-button align">
          <i class="fa-solid fa-align-left"> </i>
        </button>

        <button id="justifyCenter" class="option-button align">
          <i class="fa-solid fa-align-center"></i>
        </button>
        <button id="justifyRight" class="option-button align">
          <i class="fa-solid fa-align-right"></i>
        </button>

        <button id="justifyFull" class="option-button align">
          <i class="fa-solid fa-align-justify"></i>
        </button>

        <button id="indent" class="option-button spacing">
          <i class="fa-solid fa-indent"></i>
        </button>

        <button id="outdent" class="option-button spacing">
          <i class="fa-solid fa-outdent"></i>
        </button>

        <select name="" id="formatBlock" class="adv-option-button">
          <option value="H1">H1</option>
          <option value="H2">H2</option>
          <option value="H3">H3</option>
          <option value="H4">H4</option>
          <option value="H5">H5</option>
          <option value="H6">H6</option>
        </select>

        <select name="" id="fontName" class="adv-option-button">

        </select>
        <select name="" id="fontSize" class="adv-option-button">

        </select>

        <div class="input-wrapper">
          <input type="color" name="" id="foreColor" class="adv-option-button"/>
          <label for="foreColor">字体颜色</label>
        </div>
        <div class="input-wrapper">
          <input type="color" name="" id="backColor" class="adv-option-button">
          <label for="backColor">突出颜色</label>
        </div>
      </div>
      <div id="text-input" contenteditable="true"></div>
    </div>

  </div>
</template>

<script>
import qs from "qs";

export default{
  data(){
    return{
      msg:'',
    }
  },
  components:{},
  methods:{
    back(){
      this.$router.push('/project');
    },
    initializer(init_msg){
      let optionsButton = document.querySelectorAll(".option-button");
      let advancedOptionButton = document.querySelectorAll(".adv-option-button");
      let fontName = document.getElementById("fontName");
      let fontSizeRef = document.getElementById("fontSize");
      // let writingArea = document.getElementById("text-input");
      let linkButton = document.getElementById("createLink");
      let alignButtons = document.querySelectorAll(".align");
      let spacingButtons = document.querySelectorAll(".spacing");
      let formatButtons = document.querySelectorAll(".format");
      let scriptButtons = document.querySelectorAll(".script");
      let saveText = document.getElementById("save");
      let createNew = document.getElementById("new")

      let fontList = ["Arial", "Verdana", "Time New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

      this.highlighter(alignButtons, true);
      this.highlighter(spacingButtons, true);
      this.highlighter(formatButtons, false);
      this.highlighter(scriptButtons, true);
      console.log(init_msg);
      if (init_msg != null)document.getElementById('text-input').innerHTML = init_msg;

      fontList.map((value) => {
        let option = document.createElement("option");
        option.value = value;
        option.innerHTML = value;
        fontName.appendChild(option);
      });

      for(let i = 1; i <= 7; i++){
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        fontSizeRef.appendChild(option);
      }

      fontSizeRef.value = 2;

      optionsButton.forEach((button) => {
        button.addEventListener("click", () => {
          this.modifyText(button.id, false, null);
        });
      });

      advancedOptionButton.forEach((button) => {
        button.addEventListener("change", () => {
          this.modifyText(button.id, false, button.value);
        });
      });

      linkButton.addEventListener("click", () => {
        let userLink = prompt("Enter a URL");
        userLink = "https://" + userLink;
        this.modifyText(linkButton.id, false, userLink);
      });

      saveText.addEventListener("click", ()=>{
        console.log(JSON.stringify(document.getElementById('text-input').innerHTML));
        let message = document.getElementById('text-input').innerHTML;
        if (message === ''){
          alert('保存内容不能为空');
          return;
        }
        let id=this.$store.state.projectid;
        let that=this;
        this.$axios({
          url: '/inserttext/',
          method: 'post',
          data: qs.stringify({
            projectid: id,
            projecttext:message
          })
        }).then(res => {
          switch (res.data.errornumber) {
            case 0:
              that.msg=res.data.message;
              break;
          }
        })
        // $.ajax({
        //     type:post,
        //     url:'/save',
        //     data:JSON.stringify(message),
        //     contentType:'application/json',
        //     success:function(response) {
        //         console.log(response);
        //     }
        // })
      });
      createNew.addEventListener('click', ()=>{
        document.getElementById('text-input').innerHTML = '<i><font color="#929090">请创建新文本</font></i>';
      })
    },
    modifyText(command, defaultUi, value) {
      document.execCommand(command, defaultUi, value);
    },

    highlighter(className, needsRemoval){
      className.forEach((button) => {
        button.addEventListener("click", () => {
          if (needsRemoval) {
            let alreadyActive = false;

            if (button.classList.contains("active")){
              alreadyActive = true;
            }

            this.highlighterRemover(className);
            if (!alreadyActive){
              button.classList.add("active");
            }
          }
          else {
            button.classList.toggle("active");
          }
        });
      });
    },

    highlighterRemover(className) {
      className.forEach((button) => {
        button.classList.remove("active");
      });
    }
  },

  mounted(){
    let id=this.$store.state.projectid;
    this.$axios({
      url: '/edittext/',
      method: 'post',
      data: qs.stringify({
        projectid: id,
      })
    }).then(res => {
      switch (res.data.errornumber) {
        case 0:
          this.msg=res.data.projecttext;
          //console.log('初始化');
          //console.log(this.msg);
          break;
      }
    })
    var f =this.msg;
    this.initializer(f);
  }
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  /* background-color: #338cf4; */
  background-color: rgba(128, 128, 128, 0.2);
}

.menu {
  height: 45px;
  border: 1px solid black;
  width: 100%;
}

.menu button {
  float: left;
  width: 50px;

}
.menu #back {
  width: 80px;
}

.container {
  background-color: #ffff;
  width: 100%;
  padding: 50px 30px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  border-radius: 10px;
  box-shadow: 0 25px 50px rgba(7, 20, 35, 0.2);
}

.text {
  position: absolute;
  width: 80%;
}

.options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
}

button {
  height: 28px;
  width: 28px;
  display: grid;
  place-items: center;
  border-radius: 3px;
  /* border: none; */

  background-color: #ffffff;
  outline: none;
  color: #020929
}

button:hover {
  background-color: rgba(128, 128, 128, 0.2);
}

select {
  padding: 7px;
  border: 1px solid #020929;
  border-radius: 3px;
}

.option label, .option select{
  font-family: "Poppins", sans-serif;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

input[type="color"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  width: 40px;
  height: 28px;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch {
  border-radius: 15px;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 3px #020929;
}

input[type="color"]::-moz-color-swatch {
  border-radius: 15px;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 3px #020929;
}

#text-input {
  margin-top: 10px;
  border: 1px solid #dddddd;
  padding: 50px;
  /* height: 50vh; */
  height: 300px;
  overflow: auto;
}

.active {
  background-color: #e0e9ff;
}
</style>
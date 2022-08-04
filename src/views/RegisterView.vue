<template>
  <div id="register" class="register">
    <div class="wrap">
      <h1>注 册</h1>
      <el-form :model="form" ref="form" class="form">
        <el-form-item prop="username">
          <el-input placeholder="真实姓名" type="text" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="usernickname">
          <el-input placeholder="昵称" type="text" v-model="form.usernickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input placeholder="邮箱" type="email" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item id="password1" prop="password1">
          <el-input
              placeholder="密码"
              show-password
              type="password"
              v-model="form.password1"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item id="password2" prop="password2">
          <el-input
              placeholder="确认密码"
              show-password
              type="password"
              v-model="form.password2"
              autocomplete="off"
              @keyup.enter.native="register"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn_register">
          <el-button type="primary" @click="register">注&nbsp;&nbsp;册</el-button>
        </el-form-item>
      </el-form>
      <div class="suffix">
        <p @click="toLogin">返回登陆界面</p>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "LoginView",
  data() {
    return {
      form: {
        username:'',
        usernickname:'',
        email: '',
        password1: '',
        password2:''
      }
    }
  },
  methods: {
    register: function () {
      if (this.form.email === '' || this.form.password1 === '' || this.form.password2 === '') {
        this.$message.warning("请输入邮箱和密码！");
        return;
      }
      if (this.form.username === '' || this.form.usernickname === '') {
        this.$message.warning("请输入真实姓名和昵称");
        return;
      }
      let that=this;
      console.log('123')
      this.$axios({
        method: 'post',
        url: '/register/',
        data: qs.stringify({
          username:that.form.username,
          usernickname:that.form.usernickname,
          email: that.form.email,
          password_1: that.form.password1,
          password_2:that.form.password2
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:{
                this.$message.success("注册成功！");
                setTimeout(() => {
                    this.$router.push('/login');
                }, 1000);
                break;}
              case 1:
                this.$message.error("请求方式错误");
                break;
              case 2:
                this.$message.error("邮箱已存在");
                break;
              case 3:
                this.$message.error("两次输入的密码不一致");
                break;
              case 4:
                this.$message.error("邮箱格式错误");
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
      this.$router.push('/login');
    },
    toLogin: function () {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>

#register {
  font-family: 'Noto Serif SC', serif;
  margin-top: 60px;

}
#register >>> .el-input__inner {
  font-family: 'Noto Serif SC', serif;
}

#register .logo {
  cursor: pointer;
  overflow: hidden;
  height: 150px;
}
#register .wrap {
  width: 300px;
  height: 500px;
  padding: 0 25px 0 25px;
  line-height: 40px;
  position: relative;
  display: inline-block;
  background-color: rgba(236,245,255, 0.85);
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
#register .btn_register {
  margin-top: 25px;
  text-align: center;
}
#register .btn_register button{
  line-height: 10px;
  font-family: 'Noto Serif SC', serif;
  width: 100%;
  height: 38px;
}
#register .suffix {
  font-size:14px;
  line-height:10px;
  color:#999;
  cursor: pointer;
  float:right;
}
</style>
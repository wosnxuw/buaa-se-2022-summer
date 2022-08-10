<template>
  <div id="login" class="login">
    <div class="wrap">
      <h1>登 录</h1>
      <el-form :model="form" ref="form" class="form">
        <el-form-item prop="email">
          <el-input placeholder="邮箱" type="text" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item id="password" prop="password">
          <el-input
              placeholder="密码"
              show-password
              type="password"
              v-model="form.password"
              autocomplete="off"
              @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn_login">
          <el-button type="primary" @click="login">登&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
      <div class="suffix">
        <p @click="toRegister">注册帐号</p>
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
        email: '',
        password: '',
      }
    }
  },
  methods: {
    login: function () {
      if (this.form.email === '' || this.form.password === '') {
        this.$message.warning("请输入用户名和密码！");
        return;
      }
      this.$axios({
        method: 'post',           /* 指明请求方式，可以是 get 或 post */
        url: '/login/',       /* 指明后端 api 路径，由于在 main.js 已指定根路径，因此在此处只需写相对路由 */
        data: qs.stringify({      /* 需要向后端传输的数据，此处使用 qs.stringify 将 json 数据序列化以发送后端 */
          email: this.form.email,
          password: this.form.password
        })
      })
          .then(res => {
            switch (res.data.errornumber) {
              case 0:{
                this.$message.success("登录成功！");
                /* 将后端返回的 user 信息使用 vuex 存储起来 */
                this.$store.dispatch('saveUserInfo', {
                  user: {
                    'email': res.data.email,
                    'token': res.data.token,
                    'userid': res.data.userid
                  }
                });
                this.$store.state.userid=res.data.userid;
                setTimeout(() => {
                  this.$router.push('/chooseTeam');
                }, 1000);
                break;}
              case 1:
                this.$message.error("请求方式错误");
                break;
              case 2:
                this.$message.error("用户不存在，请注册");
                break;
              case 3:
                this.$message.error("密码错误，请重试");
                break;
            }

          })
          .catch(err => {
            console.log(err);
          })
    },
    toRegister: function () {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
#login {
  font-family: 'Noto Serif SC', serif;
  margin-top: 60px;
}
#login >>> .el-input__inner {
  font-family: 'Noto Serif SC', serif;
}
#login .wrap {
  width: 300px;
  height: 315px;
  padding: 0 25px 0 25px;
  line-height: 40px;
  position: relative;
  display: inline-block;
  background-color: rgba(236,245,255, 0.85);
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
#login .btn_login {
  margin-top: 25px;
  text-align: center;
}
#login .btn_login button{
  line-height: 10px;
  font-family: 'Noto Serif SC', serif;
  width: 100%;
  height: 38px;
}
#login .suffix {
  font-size:14px;
  line-height:10px;
  color:#999;
  cursor: pointer;
  float:right;
}
</style>
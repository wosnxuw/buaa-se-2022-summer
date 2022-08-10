<template>
  <div id="home" class="home">

    <!--上方logo-->
    <div>
      <el-image class="logo" style="width: 500px; height: 500px" :src="require('@/assets/newlogo.png')" fit="fill"></el-image>
    </div>

    <!--开始使用-->
    <div class="main">
      <el-button class="start-button" type="primary"   @click="start" >开 始 使 用</el-button>
    </div>

  </div>
</template>

<script>
export default {
  methods: {
    start() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.main {
  width: 250px;
  height: 60px;
  padding: 0 25px 0 25px;
  line-height: 40px;
  position: relative;
  display: inline-block;
  border-radius: 20px;
}
.start-button{
  text-align: center;
  line-height: 50px;
  font-family: 'Noto Serif SC', serif;
  width: 100%;
  height: 80px;
  font-size: larger;
}

</style>
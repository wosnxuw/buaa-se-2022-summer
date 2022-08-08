<template>
  <el-container>
    <el-header>
      <ProjectMenu>
      </ProjectMenu>
    </el-header>
    <el-container>
      <el-main>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ProjectMenu from "@/components/ProjectMenu";
export default {
  name: "DrawList",
  components: {ProjectMenu},
}
</script>

<style scoped>

</style>
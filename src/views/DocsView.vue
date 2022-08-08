<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">
        <el-menu-item index="-1" @click="toChoose">返回</el-menu-item>
        <el-menu-item index="-2" @click="toProject">项目管理</el-menu-item>
        <el-menu-item index="-3" @click="toManageTeam">管理团队</el-menu-item>
        <el-menu-item index="-4" @click="toDocs">文档中心</el-menu-item>
        <el-menu-item index="-5" text-color="#eb5451">
          <el-button type="text" @click="logout">退出登陆</el-button>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-row>
          <el-col :span="12" :offset="3"><div>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div></el-col>
        </el-row>

      </el-aside>
      <el-main>
        <DocEdit>
        </DocEdit>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import DocEdit from "@/components/DocEdit";
export default {
  name: "DocsView",
  components: {DocEdit},
  data() {
    return {
      activeIndex:'-4',
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    toDocs(){
      this.$router.push('/docs');
    },
    toManageTeam() {
      this.$router.push('/manageTeam');
    },
    logout() {
      this.$confirm('您即将退出登陆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /*给一个消息提示一下，不给也行*/
        this.$message({
          type: 'success',
          message: '退出成功!'
        });
        this.$store.dispatch('clear');
        this.$router.push('/login');
      }).catch(() => {
        this.$message({
          type: 'info',
          showClose: true,
          message: '已放弃'
        });
      });
    },
    toProject() {
    },
    toRubbish() {
      this.$router.push('/manageRubbish');
    },
    toAdd() {
      this.$router.push('/addProject');
    },
    toChoose(){
      this.$router.push('/chooseTeam');
    },
  }
}
</script>

<style scoped>
el-tree{
  margin-top: 40px;
  margin-left: 20px;
}
</style>
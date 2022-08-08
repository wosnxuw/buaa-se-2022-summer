import Vue from 'vue'
import Vuex from 'vuex'
import user from "./user";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projectid:-1,
    userid:-1,
    teamname:'选择队伍',
    teamid:-1
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    /* 定义清空 localStorage 的方法 */
    clear({ commit }) {
      commit("$_removeStorage");
    }
  },
  modules: {
    user
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import user from "./user";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projectid:0,
    userid:123
  },
  getters: {
  },
  mutations: {
    setprojectid(state,x){
      state.projectid= x;
    }

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

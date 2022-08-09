import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import leMarkdownEditor from 'le-markdown-editor'

Vue.use(ElementUI);
Vue.use(leMarkdownEditor)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://101.43.151.164:8000';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

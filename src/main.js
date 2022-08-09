import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import leMarkdownEditor from 'le-markdown-editor'

// wkq
import * as echarts from 'echarts';
import dataV from '@jiaminghi/data-view';
import '@/permission'; // permission control
import { registerOption } from '@/components/registerOption';
import '@/assets/font/custom-font.css';

Vue.prototype.$echarts = echarts;
Vue.use(dataV);

Vue.use(ElementUI);
Vue.use(leMarkdownEditor)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://101.43.151.164:8000';

registerOption();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

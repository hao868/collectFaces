import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Vant, { Toast } from 'vant'

// axios.defaults.baseURL = window.globalUrl;

import 'vant/lib/index.css' // 修改了toast模式了。

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(Vant)
Vue.prototype.$toast = Toast

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

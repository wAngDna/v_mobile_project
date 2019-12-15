import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import plugin from '@/utils/plugin'
import VueLazyload from 'vue-lazyload'
// 覆盖vant的样式
import '@/styles/index.less'
// 注册好了 支持v-lazy指令
Vue.use(Lazyload)
Vue.use(VueLazyload)
Vue.use(Vant)
Vue.use(plugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

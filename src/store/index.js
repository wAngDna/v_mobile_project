import Vue from 'vue'
import Vuex from 'vuex'
// 按需导出全部导入
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser(), // vuex中设置user数据存储token
    photo: null
  },
  mutations: {
    // 设置信息
    setUser (state, user) {
      state.user = user
      // 更新本地存储
      auth.setUser(user)
    },
    setPhoto (state, data) {
      state.photo = data
    },
    // 删除信息
    delUser (state) {
      state.user = {}
      auth.delUser()
    }
  },
  actions: {}
})

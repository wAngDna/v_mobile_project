// 配置axios,使用配置好的axios
// 处理js最大安全数值，使用jsonbigint
// 配置请求头携带token值
// 导出一个发请求的工具函数
import axios from 'axios'
import jsonbigint from 'json-bigint'
import store from '@/store'
import router from '../router'
const nAxios = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 修改原始数据
  transfromResponse: [(data) => {
    try {
      return jsonbigint.parse(data)
    } catch (e) {
      return data
    }
  }]
  // 只适用于 POST,PUT,PATCH，transformRequest`
  // 允许在将数据传给.then和.catch之前修改原始数据。
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
})
// 请求拦截器配置
nAxios.interceptors.request.use(config => {
  // 成功拦截，修改headers,获取token,配置token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => { return Promise.reject(err) }) // 出错直接返回promise错误对象
// 响应拦截器，获取有效数据res.data.data
nAxios.interceptors.response.use(res => {
  // 处理响应
  // 调用接口是，then()的传参就是现在的return
  try {
    return res.data.data // 直接返回数据，不需要自己data.data找数据
  } catch (e) {
    return res
  }
}, async errs => {
  // token刷新
  // 判断是否返回401状态
  // 如果未登录(拦截到登录页，预留回跳功能)
  // 如果token失效进行token刷新并更新vuex和本地数据
  // 刷新成功,把原本的请求继续发出去
  // 刷新失败,删除vuex和本地数据，拦截到登录页面
  const loginRoute = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
  if (errs.response && errs.response.status === 401) {
    // 拦截登录的跳转地址,this.$route.path ===router.currentRoute
    const { user } = store.state
    // 用户没有登录过
    if (!user || !user.token || !user.refresh_token) {
      // return router.push(loginRoute)
      // 响应拦截的error函数，必须返回一个错误的Promise对象，才认为是一个异常，阻止程序运行。
      router.push(loginRoute)
      return Promise.reject(errs)
    }
    try {
      // token失效
      // 此时使用instance将会有一些配置已经生效了。头部需要携带的是refresh_token
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}` // 需要携带刷新token信息区刷新
        }
      })
      // 刷新成功，更新信息
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      // 把原本请求继续发出去
      // 使用nAxios发
      return nAxios(errs.config)
    } catch (e) {
      // 刷新失败，删除token等信息
      store.commit('delUser')
      return router.push(loginRoute)
    }
  }
  return Promise.reject(errs)
})
// 导出配置好的axios用来发送请求
export default (url, method, data) => {
  return nAxios({
    url,
    method,
    // 当请求方式是get 用params来传参，其他用data方式传参
    // 根据方式不同，设置不同传参属性，params | data
    // []写表达式，返回的结果一定要是字符串
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}

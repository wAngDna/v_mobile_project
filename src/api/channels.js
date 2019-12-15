import request from '@/utils/request'
import store from '@/store'
// 用户登录接口封装

/**
 * 用户登录
 * loginForm{String} --mobile--code
 */
// 用户频道
const CHANNEL_KEY = 'hm-toutiao-m-85-channel-key'
export const channels = () => {
  // return request('/app/v1_0/user/channels', 'get')
  // 一定要返回一个Promise对象
  return new Promise(async (resolve, reject) => {
    let { user } = store.state
    if (user.token) {
      // 第一种情况，用户登录，获取用户channels
      let res = await request('/app/v1_0/user/channels', 'get')
      resolve(res)
    } else {
      // 第二种情况，用户未登录，但是本地有列表数据，否则返回空
      let strKey = window.localStorage.getItem(CHANNEL_KEY) || '[]'
      let localChannels = JSON.parse(strKey)
      if (!localChannels.length) {
        // 三，用户未登录也没有自定义列表，直接返回系统默认列表
        let data = await request('/app/v1_0/user/channels', 'get')
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(data.channels))
        resolve(data)
      } else {
        // 用户有本地列表 直接返回
        resolve({ channels: localChannels })
      }
    }
  })
}
// 全部频道
export const allChannels = (orderChannels) => {
  return request('/app/v1_0/channels', 'get')
}
// 添加我的频道{Array}-orderChannels - 排序好的频道
export const addChannel = (orderChannels) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { user } = store.state
      if (user.token) {
        // 已登录
        await request('/app/v1_0/user/channels', 'put', {
          channels: orderChannels
        })
        resolve()
      } else {
        // 未登录
        let localChannels = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
        // 追加频道
        let { id, name } = orderChannels[orderChannels.length - 1]
        localChannels.push({ id, name })
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannels))
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}
// 删除我的频道{int} -频道id
export const delChannel = (channelId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = store.state
      // 已登录
      if (user.token) {
        await request(`/app/v1_0/user/channels/${channelId}`, 'delete')
        resolve()
      } else {
        // 未登录
        let localChannels = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
        // 进行删除
        localChannels.splice(localChannels.findIndex(item => item.id === channelId), 1)
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannels))
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

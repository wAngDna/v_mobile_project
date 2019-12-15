import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
/**
     * 过滤器函数
     * @param {String} strDate - 就是过滤器 | 前的表达式的值
     */
const relTime = (strDate) => {
  // 转换的逻辑
  // moment 插件  dayjs 插件  都是处理时间格式
  // dayjs 轻量一些
  return dayjs().locale('zh-cn').from(strDate)
}
export default {
  install (Vue) {
    Vue.filter('relTime', relTime)
  }
}

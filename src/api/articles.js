import request from '@/utils/request'
/**
 * channelId -频道id {int}
 * timestamp -时间戳 {相当于分页页码}
 */
const HISTORY_KEY = 'gg-toutiao-10-history-key'
export const getArticles = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
// 对文章不感兴趣{String}- articleId
export const disLike = (articleId) => {
  return request('app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}
// 举报文章{String} - articleId {type} -int 举报类型
export const report = (articleId, type) => {
  return request('app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}
// 获取历史搜索
export const getHostory = () => {
  return request('app/v1_0/search/histories', 'get')
  //   return JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]')
}
// 联想搜索{String} - q -请求前缀
export const suggest = (q) => {
  return request('app/v1_0/suggestion', 'get', { q })
}
// 搜索文章{int} param.page-页码
// {int} param.perPage -每页多少条 {String} param.q - 搜索关键字
export const searchArticles = ({ page = 1, perPage = 20, q }) => {
  return request('app/v1_0/search', 'get', {
    page,
    per_page: perPage,
    q
  })
}
// 文章详情{String} articleId -文章id
export const getArticleDetail = (articleId) => {
  return request(`/app/v1_0/articles/${articleId}`, 'get')
}
// 文章踩 {String} -articleId -文章id
export const disLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}
// 取消文章踩 {String} -articleId -文章id
export const unDisLikes = (articleId) => {
  return request(`/app/v1_0/article/dislikes/${articleId}`, 'delete')
}
// 文章赞 {String} - articleId -文章id
export const likings = (articleId) => {
  return request('/app/v1_0/article/likings', 'post', {
    target: articleId
  })
}
// 取消文章赞 {String} - articleId -文章id
export const unLikings = (articleId) => {
  return request(`/app/v1_0/article/likings/${articleId}`, 'delete')
}
// 获取评论或回复
// {String} -type a -查询文章的评论  c -查询评论的回复
// {String} -source -如果查询文章评论是文章id，如果查询回复是评论的id
// {String} -offset -查询每一页数据最后一条数据的id，当做下一页的偏移量
// {String} -limit  -每页显示多少条
export const getCommOrReplys = ({ type, source, offset, limit = 10 }) => {
  return request('/app/v1_0/comments', 'get', { type, source, offset, limit })
}

// 提交评论或者回复
// {String} target - 做评论的时候：文章ID  做回复的时候：评论ID
// {String} content - 内容
// {String} artId - 文章的ID 当你的做回复的时候
//
export const commOrReply = (target, content, artId = null) => {
  return request('/app/v1_0/comments', 'post', { target, content, art_id: artId })
}

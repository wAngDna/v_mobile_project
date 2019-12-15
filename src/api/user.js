import request from '@/utils/request'

// 用户登录接口封装

/**
 * 用户登录
 * loginForm{String} --mobile--code
 */
export const login = (loginForm) => {
  return request('/app/v1_0/authorizations', 'POST', loginForm)
}
// 获取用户基本信息
export const getUserInfo = () => {
  return request(`app/v1_0/user`, 'get')
}
// 获取用户修改资料信息
export const getUserProfile = () => {
  return request(`/app/v1_0/user/profile`, 'get')
}

/**
 *
 * 上传头像formData -photo
 */
export const saveUserPhoto = (formData) => {
  return request('/app/v1_0/user/photo', 'patch', formData)
}
// 保存用户信息
export const saveUserInfo = (name, gender = 0, birthday) => {
  return request('/app/v1_0/user/profile', 'patch', { name, gender, birthday })
}
// {int} userId -作者id
export const followed = (userId) => {
  return request('/app/v1_0/user/followings', 'post', {
    target: userId
  })
}
// 取消关注{int} userId -作者id
export const unFollowed = (userId) => {
  return request(`/app/v1_0/user/followings/${userId}`, 'delete')
}

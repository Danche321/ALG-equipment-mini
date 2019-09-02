// 授权
import request from '../utils/request.js'
const app = getApp()

// 授权获取userid
export function fetchUserId(data) {
  const code = data.code
  return request({
    url: `/wxPg/auth.action?code=${code}`,
    method: 'get'
  })
}

// 关注
export function handleFocus(data) {
  return request({
    url: `/follow/toFollow.action${data}`,
    method: 'post'
  })
}

// 取消关注
export function handleCancleFocus(data) {
  return request({
    url: `/follow/unFollow.action${data}`,
    method: 'post'
  })
}
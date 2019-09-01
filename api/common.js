// 授权
import request from '../utils/request.js'
const app = getApp()

// 获取用户信息
export function fetchUserId(data) {
  const code = data.code
  return request({
    url: `/wxPg/auth.action?code=${code}`,
    method: 'get'
  })
}
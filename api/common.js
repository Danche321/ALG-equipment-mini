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

// 获取微信手机号解密
export function fetchWxPhone(data) {
  return request({
    url: '/wxPg/wxUserPhone.action',
    method: 'get',
    data: data
  })
}

// 生成小程序码
export function fetchWxCode(data) {
  return request({
    url: '/wxPg/qr.action',
    method: 'get',
    data: data,
    responseType: 'arraybuffer',
    closeCheck: true
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

// 绑定手机号
export function handleBindPhone(data) {
  return request({
    url: `/user/bindPhone.action${data}`,
    method: 'post'
  })
}
import request from '../utils/request.js'

// 用户信息
export function fetchUserInfo({ data, closeLoading} = {}) {
  return request({
    url: '/my/personalData.action',
    method: 'get',
    data: data,
    closeLoading: closeLoading
  })
}
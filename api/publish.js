import request from '../utils/request.js'

// 发布列表
export function fetchPublish(data) {
  return request({
    url: '/publish/pageData.action',
    method: 'get',
    data: data
  })
}

// 获取发布详情
export function fetchDetail(data) {
  return request({
    url: '/publish/detail.action',
    method: 'get',
    data: data
  })
}

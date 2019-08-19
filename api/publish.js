import request from '../utils/request.js'

// 发布列表
export function fetchPublish(data) {
  return request({
    url: '/publish/pageData.action',
    method: 'get',
    data: data
  })
}

// 获取我的发布列表
export function fetchMyPublish(data) {
  return request({
    url: '/my/myPublishPageData.action',
    method: 'get',
    data: data
  })
}

// 获取我的收藏列表
export function fetchMyCollect(data) {
  return request({
    url: '/my/myCollectionPageData.action',
    method: 'get',
    data: data
  })
}

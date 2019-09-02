import request from '../utils/request.js'
const app = getApp()

// 搜索发布列表
export function fetchPublish(data) {
  return request({
    url: '/publish/pageData.action',
    method: 'get',
    data: data
  })
}

// 创建发布
export function handleCreatePublish(data) {
  return request({
    url: '/publish/publish.action',
    method: 'post',
    data: data
  })
}

// 编辑发布
export function handleUpdatePublish(data) {
  return request({
    url: '/publish/modifyPublish.action',
    method: 'post',
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

// 点赞
export function handleZan(data) {
  const userId = app.globalData.userInfo && app.globalData.userInfo.id
  const publishId = data.publishId
  return request({
    url: `/publish/like.action?userId=${userId}&publishId=${publishId}`,
    method: 'post'
  })
}

// 收藏
export function handleCollect(data) {
  const userId = app.globalData.userInfo && app.globalData.userInfo.id
  const publishId = data.publishId
  return request({
    url: `/collection/toCollect.action?userId=${userId}&publishId=${publishId}`,
    method: 'post'
  })
}

// 取消收藏
export function handleCancelCollect(data) {
  const userId = app.globalData.userInfo && app.globalData.userInfo.id
  const publishId = data.publishId
  return request({
    url: `/collection/unCollect.action?userId=${userId}&publishId=${publishId}`,
    method: 'post'
  })
}

// 评论
export function handleMsg(data) {
  return request({
    url: '/discuss/sendDiscuss.action',
    method: 'post',
    data: data
  })
}

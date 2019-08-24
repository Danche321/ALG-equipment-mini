import request from '../utils/request.js'
const app = getApp()

// 获取用户信息
export function fetchUserInfo({ data, closeLoading } = {}) {
  return request({
    url: '/my/personalData.action',
    method: 'get',
    data: data,
    closeLoading: closeLoading
  })
}

// 修改个人资料
export function handleUpdateInfo(data) {
  const userId = app.globalData.userId
  return request({
    url: `/my/personalData.action?userId=${userId}`,
    method: 'post',
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

// 获取我的动态列表
export function fetchMyDynamic(data) {
  return request({
    url: '/my/myDiscussPageData.action',
    method: 'get',
    data: data
  })
}

// 获取我的关注列表
export function fetchMyFollow(data) {
  return request({
    url: '/my/myFollowPageData.action',
    method: 'get',
    data: data
  })
}

// 获取我的粉丝列表
export function fetchMyFans(data) {
  return request({
    url: '/my/myFansPageData.action',
    method: 'get',
    data: data
  })
}

// 个人主页的发布列表
export function fetchMyHomePublish(data) {
  return request({
    url: '/my/v2/personalHomePagePublish.action',
    method: 'get',
    data: data
  })
}

//下架商品
export function handleDown(data) {
  const userId = app.globalData.userId
  const publishId = data.publishId
  return request({
    url: `/publish/downPublish.action?userId=${userId}&publishId=${publishId}`,
    method: 'post'
  })
}

// 重新上架
export function handleRePublish(data) {
  const userId = app.globalData.userId
  const publishId = data.publishId
  return request({
    url: `/publish/upPublish.action?userId=${userId}&publishId=${publishId}`,
    method: 'post'
  })
}
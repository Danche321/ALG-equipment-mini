import request from '../utils/request.js'

// 用户信息
export function fetchUserInfo({ data, closeLoading } = {}) {
  return request({
    url: '/my/personalData.action',
    method: 'get',
    data: data,
    closeLoading: closeLoading
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

// 个人主页
export function fetchMyHome(data) {
  return request({
    url: '/my/personalHomePage.action',
    method: 'get',
    data: data
  })
}
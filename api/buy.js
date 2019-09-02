import request from '../utils/request.js'
const app = getApp()

// 获取求购信息列表
export function fetchBuyList(data) {
  return request({
    url: '/purchaseInformation/getUnSoldOutPageData.action',
    method: 'get',
    data: data
  })
}

// 发布求购信息
export function handleCreateBuy(data) {
  return request({
    url: '/purchaseInformation/add.action',
    method: 'post',
    data: data
  })
}

// 获取我的求购列表
export function fetchMyBuyList(data) {
  return request({
    url: '/my/myPurchaseInformationPageData.action',
    method: 'get',
    data: data
  })
}

// 下架求购信息
export function handleDownBuy(data) {
  const userId = app.globalData.userInfo && app.globalData.userInfo.id
  const purchaseInformationId = data.purchaseInformationId
  return request({
    url: `/purchaseInformation/down.action?userId=${userId}&purchaseInformationId=${purchaseInformationId}`,
    method: 'post',
    data: data
  })
}

// 编辑求购信息
export function handleUpdateBuy(data) {
  return request({
    url: '/purchaseInformation/modify.action',
    method: 'post',
    data: data
  })
}

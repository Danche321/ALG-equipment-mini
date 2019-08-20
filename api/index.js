import request from '../utils/request.js'

// 【首页】banner列表
export function fetchBanner(data) {
  return request({
    url: '/banner/list.action',
    method: 'get',
    data: data
  })
}

// 【合作公司】列表
export function fetchCooperation(data) {
  return request({
    url: '/cooperationCompany/pageData.action',
    method: 'get',
    data: data
  })
}

// 【首页】类目
export function fetchHomeCategory(data) {
  return request({
    url: '/category/indexHot.action',
    method: 'get',
    data: data
  })
}

// 【分类】所有类别列表
export function fetchAllCategory(data) {
  return request({
    url: '/category/categoryForList.action',
    method: 'get',
    data: data
  })
}
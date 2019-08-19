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
const app = getApp()
import { fetchBanner, fetchAllCategory } from '../../../api/index.js'
import { fetchPublish } from '../../../api/publish.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 4000,
    duration: 100,
    bannerList: [],
    categoryList: [],
    publishParams: {
      pageNum: 1,
      pageSize: 10
    },
    publishList: [],
    hasNextPage: true,
    area: '全国',
    cityCode: ''
  },

  handleToSearch() {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  handleSwitchCity() {
    wx.navigateTo({
      url: '/pages/index/switchcity/switchcity',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanner()
    this.getCategory()
    this.getPublish()
  },

  // banner列表
  getBanner() {
    const params = {
      count: 6
    }
    fetchBanner(params).then(res => {
      this.setData({
        bannerList: res.data
      })
    })
  },

  // 分类
  getCategory() {
    fetchAllCategory().then(res => {
      const { data } = res
      let resArr = []
      for (let i = 0; i < data.length; i += 10) {
        resArr.push(data.slice(i, i + 10))
      }
      this.setData({
        categoryList: resArr
      })
    })
  },

  // 发布列表
  getPublish(isFirst) {
    const params = this.data.publishParams
    if (isFirst) this.data.publishParams.pageNum = 1
    fetchPublish(params).then(res => {
      const { items, hasNextPage } = res.data
      let resList = []
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.publishList, ...items]
      }
      this.setData({
        publishList: resList,
        hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.getPublish()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getBanner()
    this.getCategory()
    this.getPublish(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.data.publishParams.pageNum++
      this.getPublish()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
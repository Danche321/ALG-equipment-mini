const app = getApp()
import { fetchMyCollect } from '../../../api/my.js'
import {  handleCollect,  handleCancelCollect } from '../../../api/publish.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    listData: [],
    params: {
      pageNum: 1,
      pageSize: 10
    },
    hasNextPage: true
  },

  getList(isFirst) {
    const params = this.data.params
    if (isFirst) this.data.params.pageNum = 1
    fetchMyCollect(params).then(res => {
      const { items, hasNextPage } = res.data
      let resList = []
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.listData, ...items]
      }
      this.setData({
        listData: resList,
        hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  // 收藏
  handleCollect(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const params = {
      publishId: id
    }
    handleCollect(params).then(() => {
      wx.showToast({
        title: '已收藏',
      })
      this.data.listData[index].isCollect = !this.data.listData[index].isCollect
      this.setData({
        listData: [...this.data.listData]
      })
    })
  },
  // 取消收藏
  handleCancelCollect(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const params = {
      publishId: id
    }
    handleCancelCollect(params).then(() => {
      wx.showToast({
        title: '已取消',
        icon: 'none'
      })
      this.data.listData[index].isCollect = !this.data.listData[index].isCollect
      this.setData({
        listData: [...this.data.listData]
      })
    })
  },

  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
    })
  },

  // 跳转个人主页
  handleToUserHome(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasNextPage) {
      this.data.params.pageNum++
        this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
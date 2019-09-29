const app = getApp()
import { fetchMyFans } from '../../../api/my.js'
import {
  handleFocus,
  handleCancleFocus
} from '../../../api/common.js'
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
    hasNextPage: true,
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    this.setData({
      userId: app.globalData.userInfo && app.globalData.userInfo.id
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.data.params.pageNum++
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getList(isFirst) {
    const params = this.data.params
    if (isFirst) this.data.params.pageNum = 1
    fetchMyFans(params).then(res => {
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

  // 关注
  handleFocus(e) {
    const { id, index } = e.currentTarget.dataset
    const { userId } = this.data
    const params = `?userId=${userId}&objectId=${id}`
    handleFocus(params).then(() => {
      wx.showToast({
        title: '已关注'
      })
      this.data.listData[index].followed = true
      this.setData({
        listData: this.data.listData
      })
    })
  },

  // 取消关注
  handleCancleFocus(e) {
    console.log(e)
    const { id, index } = e.currentTarget.dataset
    const { userId } = this.data
    const params = `?userId=${userId}&objectId=${id}`
    handleCancleFocus(params).then(() => {
      wx.showToast({
        title: '已取消',
        icon: 'none'
      })
      this.data.listData[index].followed = false
      this.setData({
        listData: this.data.listData
      })
    })
  },

  // 跳转个人主页
  handleToUserHome(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${id}`,
    })
  }
})
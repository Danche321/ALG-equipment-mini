import { fetchInviteList } from '../../../api/my.js'
import {
  handleFocus,
  handleCancleFocus
} from '../../../api/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    params: {
      pageNum: 1,
      pageSize: 10
    },
    hasNextPage: true,
    userId: app.globalData.userInfo && app.globalData.userInfo.id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
    if (isFirst) this.data.params.pageNum = 1
    const params = this.data.params
    fetchInviteList(params).then(res => {
      const { items, hasNextPage } = res.data
      this.setData({
        listData: items,
        hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  // 关注
  handleFocus() {
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
import { fetchUserInfo } from '../../../api/my.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userId: app.globalData.userId
  },

  // 获取个人信息
  getUserInfo() {
    fetchUserInfo({ closeLoading: true}).then(res => {
      this.setData({
        userInfo: res.data
      })
    })
  },

  handleToHome() {
    const id = this.data.userId
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${id}`,
    })
  },
  handleToPersonInfo() {
    wx.navigateTo({
      url: '/pages/my/person-info/person-info',
    })
  },
  handleToPublish() {
    wx.navigateTo({
      url: '/pages/my/my-publish/my-publish',
    })
  },
  handleToCollect() {
    wx.navigateTo({
      url: '/pages/my/collect/collect',
    })
  },
  handleToFollow() {
    wx.navigateTo({
      url: '/pages/my/follow/follow',
    })
  },
  handleToFans() {
    wx.navigateTo({
      url: '/pages/my/fans/fans',
    })
  },
  handleToDynamic() {
    wx.navigateTo({
      url: '/pages/my/dynamic/dynamic',
    })
  },
  handleToInvite() {
    wx.navigateTo({
      url: '/pages/my/invite/invite',
    })
  },
  handleToBuy() {
    wx.navigateTo({
      url: '/pages/my/my-buy/my-buy',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
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
    this.getUserInfo()
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
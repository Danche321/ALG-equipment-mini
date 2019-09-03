import { fetchUserInfo } from '../../../api/my.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    authVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkAuthStatus()
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkAuthStatus()
    this.getUserInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取个人信息
  getUserInfo() {
    fetchUserInfo({ closeLoading: true}).then(res => {
      this.setData({
        userInfo: res.data
      })
    })
  },

  // 是否授权
  checkAuthStatus() {
    this.setData({
      authVisible: !app.globalData.userInfo
    })
  },

  authHide() {
    this.setData({
      authVisible: false
    })
    this.getUserInfo()
  },

  handleToHome() {
    const id = app.globalData.userInfo && app.globalData.userInfo.id
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
  handleToMyInvite() {
    wx.navigateTo({
      url: '/pages/my/my-invite/my-invite',
    })
  }
})
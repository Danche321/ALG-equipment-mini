const app = getApp()
import {
  fetchUserInfo
} from '../../../api/my.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    authVisible: false,
    freezVisible: app.globalData.userInfo && app.globalData.userInfo.isDeleted
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.checkAuthStatus()
    this.getUserInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 是否授权
  checkAuthStatus() {
    this.setData({
      authVisible: !app.globalData.userInfo
    })
  },

  // 获取用户信息
  getUserInfo() {
    fetchUserInfo({
      closeLoading: true
    }).then(res => {
      const { isDeleted } = res.data
      this.setData({
        freezVisible: isDeleted
      })
    })
  },

  authHide() {
    this.setData({
      authVisible: false,
      freezVisible: app.globalData.userInfo && app.globalData.userInfo.isDeleted
    })
  },

  handleToSale() {
    wx.navigateTo({
      url: '/pages/publish/create-sale/create-sale',
    })
  },
  handleToBug() {
    wx.navigateTo({
      url: '/pages/publish/create-buy/create-buy',
    })
  }
})
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkAuthStatus()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
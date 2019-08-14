// pages/my/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      headimg:'',
      nickname: '高哥哥二手机械',
      desc: '专业出售二手机械，有需要的联系我...专业出售二手机械，有需要的联系我...专业出售二手机械，有需要的联系我...'
    },
    total: {
      follow: 777,
      fans: 999,
      visitor: 9878
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
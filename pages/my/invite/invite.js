import { fetchMyInvite, fetchUserInfo } from '../../../api/my.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取我的邀请数据
  getData() {
    fetchUserInfo().then(res => {
      this.setData({
        inviteCount: res.data.inviteCount
      })
    })
  },

  handleToInvitePic() {
    wx.navigateTo({
      url: '/pages/my/invite-pic/invite-pic',
    })
  }
})
import {  fetchUserInfo } from '../../../api/my.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCount: 0,
    isOverShare: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const userId = app.globalData.userInfo && app.globalData.userInfo.id
    console.log(userId)
    return {
      title: '海量工程机械信息，邀您共享',
      path: `pages/index/share-bind/share-bind?inviteUserId=${userId}`,
      imageUrl: '', //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },

  // 获取我的邀请数据
  getData() {
    fetchUserInfo().then(res => {
      this.setData({
        inviteCount: res.data.inviteCount
      })
    })
  },

  // 提现
  handleCash() {
    wx.showModal({
      title: '温馨提示',
      content: '该功能将在次月开放，提现请添加微信号805019254，感谢您的支持和信任。',
      confirmText: '复制微信',
      success: res => {
        if (res.confirm) {
          wx.setClipboardData({
            data: '805019254',
            success: function (res) {
              wx.showToast({
                title: '已复制微信号'
              });
            }
          })
        }
      }
    })
  },

  handleToInvitePic() {
    wx.navigateTo({
      url: '/pages/my/invite-pic/invite-pic',
    })
  }
})
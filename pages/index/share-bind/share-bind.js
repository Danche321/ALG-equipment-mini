const app = getApp()
import { handleBindPhone, fetchWxPhone } from '../../../api/common.js'
import { handleBindInvite } from '../../../api/my.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    authVisible: false, // 是否授权
    code: '', // 授权手机号前获取登录code
    authVisible: false,
    phone: '', // 绑定手机号
    fromId: '', // 邀请者id
    toId: '' // 被邀请者id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkAuthStatus()
    if (options.scene) {
      this.setData({
        fromId: decodeURIComponent(options.scene)
      })
    }
    if (options.inviteUserId) {
      this.setData({
        fromId: options.inviteUserId
      })
    }
  },

  // 授权用户手机号前登录
  handleLogin() {
    wx.login({
      success: res => {
        this.setData({
          code: res.code
        })
      }
    })
  },

  // 授权用户手机号
  handleGetPhone(e) {
    if (!e.detail.encryptedData) { // 拒绝授权
      wx.showModal({
        title: '温馨提示',
        content: '首次在平台登录，需要绑定手机号码，平台承诺会对你的隐私进行保护！',
        confirmText: '游客登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/home/home',
            })
          }
        }
      })
    } else {
      const params = {
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      fetchWxPhone(params).then(res2 => {
        const phone = res2.data.phoneNumber
        this.setData({
          phone: phone
        })
        this.handleBindPhone()
      })
    }
  },

  // 绑定手机号
  handleBindPhone() {
    const { toId, phone } = this.data
    const params = `?userId=${toId}&phone=${phone}`
    handleBindPhone(params).then(() => {
      app.globalData.userInfo.phone = phone
      wx.setStorage({
        key: "userInfo",
        data: JSON.stringify(app.globalData.userInfo)
      })
      this.handleSetBind()
    })
  },

  // 完成绑定关系
  handleSetBind() {
    const { fromId, toId } = this.data
    const params = `?fromId=${fromId}&toId=${toId}`
    handleBindInvite(params).then(() => {
      wx.switchTab({
        url: '/pages/index/home/home',
      })
    })
  },

  // 是否授权
  checkAuthStatus() {
    this.setData({
      authVisible: !app.globalData.userInfo
    })
    if (app.globalData.userInfo) {
      wx.switchTab({
        url: '/pages/index/home/home',
      })
    }
  },

  authHide() {
    this.setData({
      authVisible: false
    })
    const { newBind, id, avatarUrl, nickName } = app.globalData.userInfo
    this.setData({
      toId: id
    })
    if (newBind) { // 新用户
      this.setData({
        toId: id
      })
    } else {
      wx.switchTab({
        url: '/pages/index/home/home',
      })
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const userId = this.data.fromId
    return {
      title: '全国工程二手机械信息，免费发布平台',
      path: `pages/index/share-bind/share-bind?inviteUserId=${userId}`,
      imageUrl: `${this.data.ICON_URL}share.png`, //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})
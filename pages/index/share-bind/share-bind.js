const app = getApp()
import { fetchUserId, handleBindPhone, fetchWxPhone } from '../../../api/common.js'
import { handleUpdateInfo, handleBindInvite } from '../../../api/my.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    code: '', // 授权手机号前获取登录code
    authVisible: false,
    phone: '', // 绑定手机号
    identity: '',
    activePickerIndex: '',
    identList: ['二手机械商', '机械经销商', '工程方','建筑工人','施工队/车队','非建筑工程从业者'],
    fromId: '', // 邀请者id
    toId: '' // 被邀请者id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.scene) {
      console.log(options.scene)
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

  getUserInfo(e) {
    if (e.detail.userInfo) { // 允许授权
      const { avatarUrl, nickName } = e.detail.userInfo
      wx.login({
        success: res => {
          const params = {
            code: res.code
          }
          const { identity, phone } = this.data
          if (!identity) {
            return wx.showToast({
              title: '请选择身份',
              icon: 'none'
            })
          }
          if (!phone) {
            return wx.showToast({
              title: '请验证手机号码',
              icon: 'none'
            })
          }
          // 获取userid
          fetchUserId(params).then(res => {
            const userInfo = res.data
            if (res.data.newBind) { // 新用户才能绑定
              this.setData({
                toId: userInfo.id
              })
              userInfo.headPortrait = avatarUrl
              userInfo.nickName = nickName
              app.globalData.userInfo = userInfo
              this.handleRegister(userInfo.id, nickName, avatarUrl)
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '您已经是麒麟的用户',
                confirmText: '进入平台',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/index/home/home',
                    })
                  }
                }
              })
            }
            wx.setStorage({
              key: "userInfo",
              data: JSON.stringify(userInfo)
            })
            this.triggerEvent('hideModal')
          })
        }
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
        showCancel: false
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
      })
    }
  },

  // 首次授权，注册用户信息
  handleRegister(userId, nickName, headPortrait) {
    let params = `userId=${userId}&nickName=${nickName}&headPortrait=${headPortrait}`
    // 新注册更新用户信息
    handleUpdateInfo(params).then(() => {
      this.handleBindPhone()
      this.handleSetBind()
    })
  },

  // 完成绑定关系
  handleSetBind() {
    const { fromId, toId } = this.data
    const params = `?fromId=${fromId}&toId=${toId}`
    handleBindInvite(params).then(() => {
      wx.showModal({
        title: '注册成功',
        content: '您已成为岚麒麟用户',
        confirmText: '进入平台',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/home/home',
            })
          }
        }
      })
    })
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
    })
  },

  // 选择身份
  bindPickerChange(e) {
    console.log(e)
    const index = e.detail.value
    this.setData({
      identity: this.data.identList[index],
      activePickerIndex: index
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
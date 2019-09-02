const app = getApp()
import { fetchUserId } from '../../../api/common.js'
import { handleUpdateInfo } from '../../../api/my.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authVisible: false,
    phone: '', // 绑定手机号
    identity: '',
    activePickerIndex: '',
    identList: ['二手机械商', '机械经销商', '工程方','建筑工人','施工队/车队','非建筑工程从业者']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`id:${options.inviteUserId}`)
  },

  getUserInfo(e) {
    if (e.detail.userInfo) { // 允许授权
      const { avatarUrl, nickName } = e.detail.userInfo
      wx.login({
        success: res => {
          const params = {
            code: res.code
          }
          fetchUserId(params).then(res => {
            const userInfo = res.data
            if (res.data.newBind) { // 首次授权
              userInfo.headPortrait = avatarUrl
              userInfo.nickName = nickName
              app.globalData.userInfo = userInfo
              this.handleRegister(userInfo.id, nickName, avatarUrl)
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

  // 授权用户手机号
  handleGetPhone(e) {
    if (!e.detail.encryptedData) {
      wx.showModal({
        title: '温馨提示',
        content: '首次在平台登录，需要绑定手机号码，平台承诺会对你的隐私进行保护！',
        showCancel: false
      })
    } else {
      this.setData({
        phone: 13328202442
      })
    }
  },

  // 首次授权，注册用户信息
  handleRegister(userId, nickName, headPortrait) {
    let params = `userId=${userId}&nickName=${nickName}&headPortrait=${headPortrait}`
    handleUpdateInfo(params).then(() => {
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
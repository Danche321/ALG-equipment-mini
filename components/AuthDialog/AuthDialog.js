const app = getApp()
import { fetchUserId } from '../../api/common.js'
import { handleUpdateInfo } from '../../api/my.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    // 首次授权，注册用户信息
    handleRegister(userId, nickName, headPortrait) {
      let params = `userId=${userId}&nickName=${nickName}&headPortrait=${headPortrait}`
      handleUpdateInfo(params).then(() => {
      })
    }
  }
})
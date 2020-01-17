import {  fetchUserInfo } from '../../../api/my.js'
import { fetchWxCode } from '../../../api/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    inviteCount: 0,
    isOverShare: true,
    qrCode: {
      hidden: true,
      imgUrl: ''
    },
    ruleVisible: false,
    authVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkAuthStatus()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const userId = app.globalData.userInfo && app.globalData.userInfo.id
    return {
      title: '全国工程二手机械信息，免费发布平台',
      path: `pages/index/share-bind/share-bind?inviteUserId=${userId}`,
      imageUrl: `${this.data.ICON_URL}share.png`, //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },

  // 是否授权
  checkAuthStatus() {
    if (!app.globalData.userInfo) {
      this.setData({
        authVisible: true
      })
    } else {
      this.getData()
    }
  },

  authHide() {
    this.setData({
      authVisible: false
    })
    this.getData()
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

  // 活动规则
  handleToggleRule() {
    this.setData({
      ruleVisible: !this.data.ruleVisible
    })
  },

  // canvas生成图片
  handleCanvas: function () {
    if (this.data.qrCode.imgUrl) {
      return this.setData({
        'qrCode.hidden': false
      })
    }
    wx.showLoading({
      title: '生成中...'
    })

    let inviteUserId = app.globalData.userInfo.id
    const params = {
      scene: inviteUserId,
      page: 'pages/index/share-bind/share-bind',
      width: 350
    }
    fetchWxCode(params).then(codeImg => {
      const { userId } = app.globalData.userInfo
      const headerBg = '../../../icons/bg_geren.png'
      const headerBg2 = '../../../icons/invite-bg.png'
      const headerBg3 = '../../../icons/invite-subtitle.png'
      let windowHeight, windowWidth
      wx.getSystemInfo({
        success: res => {
          windowHeight = res.windowHeight
          windowWidth = res.windowWidth
          this.setData({
            canvasWidth: res.windowWidth,
            canvasHeight: res.windowHeight
          })
        },
      })
      const ctx = wx.createCanvasContext('myCanvas')

      // 一、页面颜色填充
      ctx.rect(0, 0, windowWidth * 2 * 0.8, windowHeight * 2)
      ctx.setFillStyle('#fff')
      ctx.fill()

      // 二、头部底图
      ctx.setFillStyle('#3669f8')
      ctx.fillRect(0, 0, windowWidth * 2 * 0.8, 240)

      // 二、头部背景图
      ctx.drawImage(headerBg2, 0, 0, windowWidth, 240)
      ctx.drawImage(headerBg3, (windowWidth - 300) / 2, 30, 300, 140)
      // 三、二维码
      wx.getImageInfo({
        src: codeImg,//服务器返回的图片地址
        success: res => {
          console.log(res)
          //res.path是网络图片的本地地址
          ctx.drawImage(res.path, (windowWidth - 200) / 2, 100 + (windowHeight - 240) / 2, 200, 200)
          // 四、长按识别提示
          ctx.setFontSize(16)
          ctx.fillStyle = '#999';
          var str = "长按识别二维码,共享海量机械信息";
          ctx.fillText(str, (windowWidth - ctx.measureText(str).width) / 2, windowHeight - 50)

          // 五、小程序介绍
          ctx.setFontSize(14)
          ctx.fillStyle = '#94acdd';
          var str = "【岚麒麟工程机械，免费信息发布平台】";
          ctx.fillText(str, (windowWidth - ctx.measureText(str).width) / 2, windowHeight - 20)
          // 六、生成最终图片
          ctx.draw(false, (() => {
            setTimeout(() => {
              wx.canvasToTempFilePath({
                canvasId: 'myCanvas',
                success: res => {
                  this.setData({
                    'qrCode.imgUrl': res.tempFilePath,
                    'qrCode.hidden': false
                  })
                  setTimeout(() => {
                    wx.hideLoading()
                  }, 1500)
                },
                fail: err => {
                  console.log(err)
                  wx.showToast({
                    title: '生成失败，请重试',
                    icon: 'none'
                  })
                  wx.hideLoading()
                }
              })
            }, 300);
          })())
        },
        fail: err => {
          wx.showToast({
            title: err.errMsg,
            icon: 'none' 
          })
        }
      })
    })
  },

  // 隐藏
  hideCanvas() {
    this.setData({
      'qrCode.hidden': true
    })
  },
  // 保存图片到相册
  save: function () {
    wx.getSetting({
      success: (res) => {
        console.log(res.authSetting)
        if (res.authSetting["scope.writePhotosAlbum"] === false) { // 拒绝
          wx.showModal({
            title: '提示',
            content: '是否开启相册权限',
            success: tip => {
              if (tip.confirm) {
                wx.openSetting({
                  success: data => {
                    if (data.authSetting["scope.writePhotosAlbum"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      });
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: this.data.qrCode.imgUrl,
            success: res => {
              wx.showModal({
                content: '图片已保存到相册，快去分享给好友赚钱吧',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333'
              })
            }
          })
        }
      },
      fail: err => {
        console.warn('权限获取失败====', err)
      }
    })
  },
})
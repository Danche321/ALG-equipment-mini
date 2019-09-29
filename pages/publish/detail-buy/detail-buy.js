import { fetchDetail } from '../../../api/buy.js'
import { fetchWxCode } from '../../../api/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    isOverShare: true,
    authVisible: false, // 是否授权
    code: '', // 授权手机号前的登录code
    bindPhone: '', // 是否绑定手机号
    info: '',
    qrCode: {
      hidden: true,
      imgUrl: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      console.log(options.scene)
      this.setData({
        id: decodeURIComponent(options.scene)
      })
    }
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    this.checkAuthStatus()
    this.getDetail()
  },

  // 是否授权
  checkAuthStatus() {
    this.setData({
      authVisible: !app.globalData.userInfo,
      bindPhone: app.globalData.userInfo && app.globalData.userInfo.phone
    })
  },

  authHide() {
    this.setData({
      authVisible: false,
      bindPhone: app.globalData.userInfo && app.globalData.userInfo.phone
    })
  },

  // 详情
  getDetail() {
    const params = {
      purchaseInformationId: this.data.id
    }
    fetchDetail(params).then(res => {
      this.setData({
        info: res.data
      })
    }).catch(err => {
      console.log(err)
      if (err === '发布不存在') {
        wx.showModal({
          title: '提示',
          content: '该信息已被删除',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      }
    })
  },

  handleToHome() {
    const id = this.data.publishInfo.publishUserInfo.id
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${id}`,
    })
  },

  // 授权手机号前登录
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
        content: '为了避免恶意骚扰，首次在平台进行电话咨询，需要绑定手机号码，平台将对你的隐私进行保护！',
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
        this.handleBindPhone(phone)
      })
    }
  },

  // 绑定手机号
  handleBindPhone(phone) {
    const userId = app.globalData.userInfo.id
    const params = `?userId=${userId}&phone=${phone}`
    handleBindPhone(params).then(() => {
      this.setData({
        bindPhone: phone
      })
      app.globalData.userInfo.phone = phone
      wx.setStorage({
        key: "userInfo",
        data: JSON.stringify(app.globalData.userInfo)
      })
      wx.showModal({
        title: '温馨提示',
        content: '信息由用户自行发布，请仔细核实，联系请说岚麒麟平台！',
        confirmText: '呼叫',
        success: res => {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: phone
            })
          }
        }
      })
    })
  },

  // 拨打电话
  handleCall() {
    wx.showModal({
      title: '温馨提示',
      content: '信息由用户自行发布，请仔细核实，联系请说岚麒麟平台！',
      confirmText: '呼叫',
      success: res => {
        if (res.confirm) {
          const phone = this.data.info.contactMobile
          wx.makePhoneCall({
            phoneNumber: phone
          })
        } else if (res.cancel) {
        }
      }
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

    const { id, categorySecondName, categoryFirstName } = this.data.info
    const params = {
      scene: id,
      page: 'pages/publish/detail-buy/detail-buy',
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
          ctx.setFontSize(20)
          ctx.fillStyle = '#333';
          var str = `#求购#${categorySecondName || categoryFirstName}，扫码与我联系`;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { id, categorySecondName, categoryFirstName } = this.data.info
    const title = `#求购#${categorySecondName || categoryFirstName}`
    return {
      title: title || '麒麟二手机械',
      path: `pages/publish/detail-buy/detail-buy?id=${id}`,
      imageUrl: '',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})
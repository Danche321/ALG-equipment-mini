const app = getApp()
import { fetchWxCode } from '../../../api/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    id: '',
    title: '',
    isOverShare: true,
    qrCode: {
      hidden: true,
      imgUrl: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, title } = JSON.parse(options.params)
    this.setData({
      id,
      title
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

    const params = {
      scene: this.data.id,
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
          ctx.setFontSize(18)
          ctx.fillStyle = '#333';
          var str = `${this.data.title}, 扫码与我联系`;
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
    const { title, id, ICON_URL } = this.data
    return {
      title: title || '麒麟二手机械',
      path: `pages/publish/detail-buy/detail-buy?id=${id}`,
      imageUrl: `${ICON_URL}share.png`, //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})
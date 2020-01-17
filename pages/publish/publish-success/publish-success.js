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
    imgUrl: '',
    imgList: [],
    selfImgUrl: [],
    showAreaName: '',
    isOverShare: true,
    downInterval: null,
    qrCode: {
      hidden: true,
      imgUrl: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { id, title, imgUrl, imgList, showAreaName } = JSON.parse(options.params)
    // const {
    //   id,
    //   title,
    //   imgUrl,
    //   imgList,
    //   showAreaName
    // } = { "id": 21, "title": "浙江杭州转让工地退场挖机一部，性能极佳，带回去直接下工地，需要的联系", "imgUrl": "https://mechanical-test.oss-cn-hangzhou.aliyuncs.com/8a13eb88-50e9-4850-9129-728803660a8d5Jcnk59lr2.o6zAJs-mJqNgDhoJ2UJgArGqiie0.D5QKtAXnMF2X6c93083adbb548303ad6b3f7366baa48.jpeg", "imgList": ["https://mechanical-test.oss-cn-hangzhou.aliyuncs.com/8a13eb88-50e9-4850-9129-728803660a8d5Jcnk59lr2.o6zAJs-mJqNgDhoJ2UJgArGqiie0.D5QKtAXnMF2X6c93083adbb548303ad6b3f7366baa48.jpeg", "https://mechanical-test.oss-cn-hangzhou.aliyuncs.com/4640cf26-f6d3-48dd-bc30-88846951e43dUvHBmTj9vc.o6zAJs-mJqNgDhoJ2UJgArGqiie0.t6IFNEjwSzEl18bc829933e8cf60963f998f88981f9d.jpeg", "https://mechanical-test.oss-cn-hangzhou.aliyuncs.com/080c3082-6aec-43ee-a3b7-0ba690d55ee0JAoxg4RFAz.o6zAJs-mJqNgDhoJ2UJgArGqiie0.0ZEcqGUTNw8x6c93083adbb548303ad6b3f7366baa48.jpeg", "https://mechanical-test.oss-cn-hangzhou.aliyuncs.com/b3191e7e-3136-4c60-b076-5db035ff6b17FuKDnV3Anb.o6zAJs-mJqNgDhoJ2UJgArGqiie0.Lm1aNSZp7VQJ18bc829933e8cf60963f998f88981f9d.jpeg"], "showAreaName": "浙江省·杭州市" }
    this.setData({
      id,
      title,
      imgUrl,
      imgList: imgList.splice(0, 3),
      showAreaName
    })
  },

  onUnload: function() {
    wx.switchTab({
      url: `/pages/index/home/home`,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const {
      id,
      title,
      imgUrl
    } = this.data
    return {
      title: title || '麒麟二手机械',
      path: `pages/publish/detail/detail?id=${id}`,
      imageUrl: imgUrl, //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      success: function(res) {
      },
      fail: function(res) {
      }
    }
  },

  // 先下载最多三张图
  handleDownFile () {
    const imgList = this.data.imgList
    wx.getImageInfo({
      src: imgList[0],
      success: res => {
        this.data.selfImgUrl = [...this.data.selfImgUrl, res.path]
      }
    })
    if (imgList[1]) {
      wx.getImageInfo({
        src: imgList[1],
        success: res => {
          this.data.selfImgUrl = [...this.data.selfImgUrl, res.path]
        }
      })
    }
    if (imgList[2]) {
      wx.getImageInfo({
        src: imgList[2],
        success: res => {
          this.data.selfImgUrl = [...this.data.selfImgUrl, res.path]
        }
      })
    }
  },

  // canvas生成图片
  handleCanvas: function() {
    if (this.data.qrCode.imgUrl) {
      return this.setData({
        'qrCode.hidden': false
      })
    }
    wx.showLoading({
      title: '生成中...'
    })
    this.handleDownFile()
    this.data.downInterval = setInterval(() => {
      if (this.data.selfImgUrl.length === this.data.imgList.length) {
        clearInterval(this.data.downInterval)
        const imgList = this.data.selfImgUrl
        const {
          nickName,
          phone
        } = app.globalData.userInfo
        const {
          title,
          id,
          imgUrl,
          showAreaName
        } = this.data
        const headerBg = '../../../icons/bg_geren.png'
        const mobileIcon = '../../../icons/mobile.png'
        const locationIcon = '../../../icons/location-white.png'
        let windowHeight, windowWidth
        wx.getSystemInfo({
          success: res => {
            windowHeight = res.windowHeight
            windowWidth = res.windowWidth
          },
        })

        const ctx = wx.createCanvasContext('myCanvas')

        // #页面颜色填充
        ctx.rect(0, 0, windowWidth * 2 * 0.8, windowHeight * 2 * 0.8)
        ctx.setFillStyle('#fff')
        ctx.fill()

        // #头部背景图
        ctx.drawImage(headerBg, 0, 0, 400, 240)

        // #设置介绍
        ctx.setFontSize(18)
        ctx.fillStyle = '#f1f1f1';
        var text = `#转让#${title}`;

        var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
        var temp = "";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < windowWidth - 60) {
            temp += chr[a];
          }
          else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);

        //如果数组长度大于2 则截取前2个
        if (row.length > 2) {
          var rowCut = row.slice(0, 2);
          // 这个参数就可以判断显示几行
          var rowPart = rowCut[0];
          var test = "";
          var empty = [];
          for (var a = 0; a < rowPart.length; a++) {
            if (ctx.measureText(test).width < windowWidth) {
              test += rowPart[a];
            }
            else {
              break;
            }
          }

          empty.push(test);
          var group = empty[0]//这里只显示两行，超出的用...表示
          rowCut.splice(1, 1, group);
          row = rowCut;

        }
        for (var b = 0; b < row.length; b++) {
          ctx.fillText(row[b], 20, 40 + b * 23);
        }

        // #设置设备图片
        for (let i = 0, len = imgList.length; i < len; i++) {
          let size = (windowWidth - 50) / 3 
          let left
          if (i === 0) {
            left = 20
          } else if (i ===1) {
            left = size + 30
          } else if (i === 2) {
            left = size*2 + 40
          }
          ctx.drawImage(imgList[i], left, 80, size, size)
        }

        // #地区
        ctx.drawImage(locationIcon, 20, 210, 12, 17)
        ctx.setFontSize(15)
        ctx.fillStyle = '#fff';
        ctx.fillText(showAreaName, 40, 225)

        // #联系电话
        ctx.drawImage(mobileIcon, windowWidth - 135, 210, 16, 16)
        ctx.setFontSize(15)
        ctx.fillStyle = '#fff';
        ctx.fillText(phone, windowWidth - 110, 225)
        wx.getImageInfo({
          src: '',
        })
        // #二维码
        const params = {
          scene: this.data.id,
          page: 'pages/publish/detail/detail',
          width: 350
        }
        fetchWxCode(params).then(codeImg => {
          wx.getImageInfo({
            src: codeImg,//服务器返回的图片地址
            success: res => {
              ctx.drawImage(res.path, (windowWidth - 180) / 2, 80 + (windowHeight - 180) / 2, 180, 180)

              // #长按识别提示
              ctx.setFontSize(16)
              ctx.fillStyle = '#999';
              var str = "长按识别二维码,查看设备信息详情";
              ctx.fillText(str, (windowWidth - ctx.measureText(str).width) / 2, windowHeight - 50)

              // #小程序介绍
              ctx.setFontSize(14)
              ctx.fillStyle = '#94acdd';
              var str = "【岚麒麟二手机械，免费信息发布平台】";
              ctx.fillText(str, (windowWidth - ctx.measureText(str).width) / 2, windowHeight - 20)

              // 生成最终图片
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
      }
    }, 1000)
  },

  // 隐藏
  hideCanvas() {
    this.setData({
      'qrCode.hidden': true
    })
  },

  // 保存图片到相册
  save: function() {
    wx.getSetting({
      success: (res) => {
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
                content: '图片已保存到相册，赶紧晒一下吧~',
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
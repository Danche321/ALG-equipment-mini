import {
  fetchPersonHome,
  fetchMyHomePublish,
  handleUpdateHomeBg
} from '../../../api/my.js'
import {
  fetchMyBuyList
} from '../../../api/buy.js'
import {
  handleFocus,
  handleCancleFocus,
  handleBindPhone,
  fetchWxPhone,
  fetchWxCode
} from '../../../api/common.js'
const app = getApp()
Page({
  data: {
    ICON_URL: app.globalData.ICON_URL,
    isOverShare: true,
    authVisible: false,
    code: '', // 授权手机号前获取登录code
    bindPhone: '', // 是否绑定手机号
    statusBarHeight: '',
    whoId: '', // 主页者id
    userId: '', // 当前用户id
    userInfo: null,
    followed: false, // 是否关注
    sale: {
      listData: [],
      params: {
        whoId: '',
        pageNum: 1,
        pageSize: 10
      },
      totalCount: 0,
      hasNextPage: false
    },
    buy: {
      listData: [],
      params: {
        userId: '',
        shelfStatus: 1,
        pageNum: 1,
        pageSize: 10
      },
      totalCount: 0,
      hasNextPage: false
    },
    activeTab: 'sale',
    qrCode: {
      hidden: true,
      imgUrl: '',
      headPortrait: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let whoId
    console.log(options)
    if (options.scene) {
      console.log(options.scene)
      whoId = decodeURIComponent(options.scene)
    }
    if (options.id) {
      whoId = options.id
    }
    this.setData({
      whoId: whoId,
      userId: app.globalData.userInfo && app.globalData.userInfo.id,
      'sale.params.whoId': whoId,
      'buy.params.userId': whoId
    })
    this.checkAuthStatus()
    this.setHeaderConfig()
    if (app.globalData.userInfo) {
      this.getHomeInfo()
      this.getSaleList()
      this.getBuyList()
    }
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
    const { nickName, provinceName, userId, location, publishCount, signature, phone } = this.data.userInfo
    const { headPortrait } = this.data.qrCode
    const headerBg = '../../../icons/bg_geren.png'
    const mobileIcon = '../../../icons/mobile.png'
    let windowHeight, windowWidth
    wx.getSystemInfo({
        success: res => {
          windowHeight = res.windowHeight
          windowWidth = res.windowWidth
      },
    })

    const ctx = wx.createCanvasContext('myCanvas')

    // 一、页面颜色填充
    ctx.rect(0, 0, windowWidth*2*0.8, windowHeight*2 *0.8)
    ctx.setFillStyle('#fff')
    ctx.fill()

    // 二、头部背景图
    ctx.drawImage(headerBg, 0, 0, 400, 240)

    // 三、设置头像
    const avatarurl_width = 85;    //绘制的头像宽度
    const avatarurl_heigth = 85;   //绘制的头像高度
    const avatarurl_x = 30;   //绘制的头像在画布上的位置
    const avatarurl_y = 30;   //绘制的头像在画布上的位置
    ctx.save();
    ctx.beginPath(); //开始绘制
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);

    ctx.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因

    ctx.drawImage(headPortrait, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片，必须是https图片

    ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制

    // 四、设置昵称
    ctx.setFontSize(22)
    ctx.fillStyle = '#fff';
    ctx.fillText(nickName, 135, 80)

    // 五、设置介绍
    ctx.setFontSize(16)
    ctx.fillStyle = '#f1f1f1';
    var text = signature || `我在【岚麒麟二手工程机械】发布了${publishCount}个机械设备，快来看看吧`;

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
    if (row.length > 3) {
      var rowCut = row.slice(0, 3);
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
      ctx.fillText(row[b], 30, 150 + b * 23);
    }

    // 六、联系电话
    ctx.drawImage(mobileIcon, windowWidth - 135, 210, 16, 16)
    ctx.setFontSize(15)
    ctx.fillStyle = '#fff';
    ctx.fillText(phone || '13328202442', windowWidth - 110, 225)

    // 七、二维码
    const params = {
      scene: this.data.whoId,
      page: 'pages/my/person-home/person-home',
      width: 350
    }
    fetchWxCode(params).then(codeImg => {
      wx.getImageInfo({
        src: codeImg,//服务器返回的图片地址
        success: res => {
          ctx.drawImage(res.path, (windowWidth - 200) / 2, 100 + (windowHeight - 240) / 2, 200, 200)

          // 八、长按识别提示
          ctx.setFontSize(16)
          ctx.fillStyle = '#999';
          var str = "长按识别二维码,查看我的麒麟小店";
          ctx.fillText(str, (windowWidth - ctx.measureText(str).width) / 2, windowHeight - 80)

          // 九、小程序介绍
          ctx.setFontSize(14)
          ctx.fillStyle = '#94acdd';
          var str = "【岚麒麟工程机械，免费信息发布平台】";
          ctx.fillText(str, (windowWidth - ctx.measureText(str).width) / 2, windowHeight - 50)

          // 十、生成最终图片
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

  // tab切换
  handleTabChange(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      activeTab: type
    })
  },

  // banner滑动
  handleSwiperChange(e) {
    const index = e.detail.current
    this.setData({
      activeTab: index === 0 ? 'sale' : 'buy'
    })
  },

  handleBack() {
    if (getCurrentPages().length>1) {
      wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.switchTab({
        url: '/pages/index/home/home',
      })
    }
  },

  // 获取个人主页信息
  getHomeInfo() {
    const params = {
      userId: this.data.userId, // 当前用户id
      whoId: this.data.whoId, // 主页者id
      pageSize: 1
    }
    fetchPersonHome(params).then(res => {
      const {
        whoInfo,
        followed
      } = res.data
      this.setData({
        userInfo: whoInfo,
        followed: followed
      })
      // 下载网络图片
      wx.getImageInfo({
        src: whoInfo.headPortrait,    //请求的网络图片路径
        success: res => {
          this.setData({
            'qrCode.headPortrait': res.path
          })
        }
      })
    })
  },

  // 获取发布列表
  getSaleList(isFirst) {
    const params = this.data.sale.params
    if (isFirst) this.data.sale.params.pageNum = 1
    fetchMyHomePublish(params).then(res => {
      const {
        items,
        hasNextPage,
        totalCount
      } = res.data
      let resList = []
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.sale.listData, ...items]
      }
      this.setData({
        'sale.listData': resList,
        'sale.hasNextPage': hasNextPage,
        'sale.totalCount': totalCount
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  // 获取求购列表
  getBuyList(isFirst) {
    const params = this.data.buy.params
    fetchMyBuyList(params).then(res => {
      const {
        items,
        hasNextPage,
        totalCount
      } = res.data
      let resList = []
      items.map(item => {
        let locationText
        if (item.locationDetail.provinceName === item.locationDetail.cityName || !item.locationDetail.cityName) {
          locationText = item.locationDetail.provinceName
        } else {
          locationText = `${item.locationDetail.provinceName}·${item.locationDetail.cityName}`
        }
        item.locationText = locationText
        item.tags = [item.newOldLevel, item.categoryFirstName, item.categorySecondName]
        return item
      })
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.buy.listData, ...items]
      }
      this.setData({
        'buy.listData': resList,
        'buy.hasNextPage': hasNextPage,
        'buy.totalCount': totalCount
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  // 详情
  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
    })
  },

  // 自定义头部
  setHeaderConfig() {
    wx.getSystemInfo({
      success: (res) => {
        const sys = wx.getSystemInfoSync()
        const statusHeight = sys.statusBarHeight
        this.setData({
          statusBarHeight: statusHeight
        })
      },
      fail: () => {}
    })
  },

  // 转让信息滚动到底部
  saleReachBottom() {
    if (this.data.sale.hasNextPage) {
      this.data.sale.params.pageNum++
        this.getSaleList()
    }
  },

  // 求购信息滚动到底部
  buyReachBottom() {
    if (this.data.buy.hasNextPage) {
      this.data.buy.params.pageNum++
        this.getBuyList()
    }
  },

  // 是否授权
  checkAuthStatus() {
    this.setData({
      authVisible: !app.globalData.userInfo,
      bindPhone: app.globalData.userInfo && app.globalData.userInfo.phone
    })
  },

  // 授权成功
  authHide() {
    this.setData({
      authVisible: false,
      bindPhone: app.globalData.userInfo && app.globalData.userInfo.phone,
      userId: app.globalData.userInfo && app.globalData.userInfo.id
    })
    this.getHomeInfo()
    this.getSaleList()
    this.getBuyList()
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

  // 二维码授权手机号
  handleGetPhoneCode (e) {
    if (e.detail.encryptedData) {
      const params = {
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      fetchWxPhone(params).then(res2 => {
        const bindPhone = res2.data.phoneNumber
        const userId = app.globalData.userInfo && app.globalData.userInfo.id
        const params = `?userId=${userId}&phone=${bindPhone}`
        handleBindPhone(params).then(() => {
          this.setData({
            bindPhone: bindPhone
          })
          app.globalData.userInfo.phone = bindPhone
          wx.setStorage({
            key: "userInfo",
            data: JSON.stringify(app.globalData.userInfo)
          })
          // 绑定成功生成二维码
          this.handleCanvas()
        })
      })
    }
  },

  // 授权用户手机号
  handleGetPhone(e) {
    const contactPhone = e.target.dataset.phone
    if (!e.detail.encryptedData) { // 拒绝授权
      wx.showModal({
        title: '温馨提示',
        content: '为了避免恶意骚扰，首次在平台进行电话咨询，需要绑定手机号码，平台将对你的隐私进行保护！',
        showCancel: false
      })
    } else { // 同意
      const params = {
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      fetchWxPhone(params).then(res2 => {
        const bindPhone = res2.data.phoneNumber
        this.handleBindPhone(bindPhone, contactPhone)
      })
    }
  },

  // 绑定手机号
  handleBindPhone(bindPhone, contactPhone) {
    const userId = app.globalData.userInfo && app.globalData.userInfo.id
    const params = `?userId=${userId}&phone=${bindPhone}`
    handleBindPhone(params).then(() => {
      this.setData({
        bindPhone: bindPhone
      })
      app.globalData.userInfo.phone = bindPhone
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
              phoneNumber: contactPhone
            })
          }
        }
      })
    })
  },

  // 拨打电话
  handleCall(e) {
    wx.showModal({
      title: '温馨提示',
      content: '信息由用户自行发布，请仔细核实，联系请说岚麒麟平台！',
      confirmText: '呼叫',
      success: res => {
        if (res.confirm) {
          const phone = e.currentTarget.dataset.phone
          wx.makePhoneCall({
            phoneNumber: phone
          })
        } else if (res.cancel) { }
      }
    })
  },

  // 关注
  handleFocus() {
    const { userId, whoId } = this.data
    const params = `?userId=${userId}&objectId=${whoId}`
    handleFocus(params).then(() => {
      wx.showToast({
        title: '已关注',
      })
      this.setData({
        followed: true
      })
    })
  },

  // 取消关注
  handleCancleFocus() {
    const { userId, whoId } = this.data
    const params = `?userId=${userId}&objectId=${whoId}`
    handleCancleFocus(params).then(() => {
      wx.showToast({
        title: '已取消',
        icon: 'none'
      })
      this.setData({
        followed: false
      })
    })
  },

  // 弹出修改封面照
  handleChangeBg () {
    const { whoId, userId } = this.data
    if (whoId != userId) return false
    wx.showActionSheet({
      itemList: ['更换相册封面'],
      success: res => {
        if (res.tapIndex === 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
              const srcArr = res.tempFilePaths
              const size = res.tempFiles[0].size / (1024 * 1024);
              if (size > 4) {
                app.showErrMsg('存在超过4M的图片上传失败');
                return;
              }
              this.uploadImg(srcArr[0])
            }
          })
        }
      },
      fail(res) {
        console.log('fail')
        console.log(res.errMsg)
      }
    })
  },

  uploadImg(filePath) {
    var self = this;
    wx.showLoading({
      title: '上传中'
    })
    wx.uploadFile({
      url: `${app.globalData.BASE_URL}/global/upload`, //开发者服务器
      filePath: filePath,
      name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
      success: res => {
        const { domainUrl } = JSON.parse(res.data).data
        const params = `?userId=${this.data.userId}&backgroundImage=${domainUrl}`
        handleUpdateHomeBg(params).then(res => {
          wx.showToast({
            title: '更换成功',
          })
          this.setData({
            'userInfo.backgroundImage': domainUrl
          })
        })
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
      }
    })
  },

  handleToBuyDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail-buy/detail-buy?id=${id}`,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.activeTab === 'sale') {
      this.getSaleList(1)
    } else {
      this.getBuyList(1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { whoId, userInfo } = this.data
    return {
      title: `【${userInfo.nickName}】的麒麟小店`,
      path: `pages/my/person-home/person-home?id=${whoId}`,
      imageUrl: '',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})
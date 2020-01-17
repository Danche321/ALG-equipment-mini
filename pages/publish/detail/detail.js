import {
  fetchDetail,
  handleZan,
  handleCollect,
  handleCancelCollect,
  handleMsg
} from '../../../api/publish.js'
import {
  handleBindPhone,
  fetchWxPhone,
  handleSendTemplate
} from '../../../api/common.js'
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    isOverShare: true,
    id: '',
    authVisible: false, // 是否授权
    code: '', // 授权手机号前的登录code
    bindPhone: '', // 是否绑定手机号
    publishInfo: null, // 发布信息
    headimgTest: '{{ICON_URL}}headimg.png',
    interval: 3000,
    duration: 100,
    swiperCurrent: 0,
    voice: {
      second: 30
    },
    messageList: [],
    likeDown: false,
    collectionDown: false,
    message: {
      visible: false,
      params: {
        content: '',
        publishId: '',
        beDiscussId: '', // 回复的动态的ID
        floorDiscussId: '', // 主楼id
        floorDiscussUserId: '', // 主楼发布者id
      },
      placeholder: ''
    },
    isPlaying: false, // 播放状态
    hasVideo: false, // 是否含有视频
    templateUserId: '', // 接收消息推送者id
    moreVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getCurrentPages().length)
    if (getCurrentPages().length === 1) {
      this.setData({
        moreVisible: true
      })
    }
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
    this.audioConfig()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    innerAudioContext.stop()
    this.setData({
      isPlaying: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function() {
    innerAudioContext.stop()
    this.setData({
      isPlaying: false
    })
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

  // 图片预览
  handlePriviewImg(event) {
    let src = event.currentTarget.dataset.src; //获取data-src
    let imgList = event.currentTarget.dataset.list.filter(item => item.type === 'IMAGE').map(item => item.file); //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  // banner滑动
  handleSwiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
    if (this.data.hasVideo) {
      const video = wx.createVideoContext('myVideo', this)
      video.pause()
    }
  },

  // 详情
  getDetail() {
    const params = {
      publishId: this.data.id || 4
    }
    fetchDetail(params).then(res => {
      const {
        collectionDown,
        likeDown,
        publish,
        discuss
      } = res.data
      this.setData({
        publishInfo: publish,
        discussInfo: discuss,
        collectionDown,
        likeDown,
        hasVideo: publish.imageVideos.some(item => item.type === 'VIDEO')
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

  // 点赞
  handleZan() {
    if (this.data.likeDown) return false
    const params = {
      publishId: this.data.id
    }
    handleZan(params).then(() => {
      this.setData({
        likeDown: !this.data.likeDown
      })
    })
  },

  // 弹出留言
  handleNewMsg() {
    this.setData({
      'message.visible': true,
      'message.params.publishId': this.data.id,
      'message.params.beDiscussId': '', // 回复的动态的ID
      'message.params.floorDiscussId': '', // 主楼id
      'message.params.floorDiscussUserId': '', // 主楼发布者id
      'message.placeholder': '看对眼就留言，问问更多细节', // 被回复者昵称
      templateUserId: this.data.publishInfo.publishUserInfo.id
    })
  },

  // 回复
  handleReply(e) {
    const {
      beReplyDiscussId,
      id,
      userId,
      userInfo
    } = e.currentTarget.dataset.info
    console.log(userId)
    this.setData({
      'message.visible': true,
      'message.params.publishId': this.data.id,
      'message.params.beDiscussId': id, // 回复的动态的ID
      'message.params.floorDiscussId': id, // 主楼id
      'message.params.floorDiscussUserId': userId, // 主楼发布者id
      'message.placeholder': `回复：${userInfo.nickName}`,
      templateUserId: userId
    })
  },

  // 回复评论
  handleReplyChild(e) {
    const {
      beReplyDiscussId,
      id,
      userId,
      userInfo
    } = e.currentTarget.dataset.info
    console.log(userId)
    const {
      floorid
    } = e.currentTarget.dataset
    this.setData({
      'message.visible': true,
      'message.params.publishId': this.data.id,
      'message.params.beDiscussId': id, // 回复的动态的ID
      'message.params.floorDiscussId': floorid, // 主楼id
      'message.params.floorDiscussUserId': userId, // 主楼发布者id
      'message.placeholder': `回复：${userInfo.nickName}`,
      templateUserId: userId
    })
  },

  // 输入留言
  handleMsgInput(e) {
    this.setData({
      'message.params.content': e.detail.value
    })
  },

  // 留言提交
  handleMsgConfirm(e) {
    const params = this.data.message.params
    handleMsg(params).then(() => {
      this.getDetail()
      this.setData({
        'message.visible': false,
        'message.params.content': ''
      })
    })
  },

  // 推送发送模板消息
  handleSendTemplate(openid) {
    const myDate = new Date()
    const year = myDate.getFullYear()
    const month = myDate.getMonth() + 1
    const day = myDate.getDate()
    const hour = myDate.getHours() < 10 ? `0${myDate.getHours()}` : myDate.getHours()
    const minute = myDate.getMinutes() < 10 ? `0${myDate.getMinutes()}` : myDate.getMinutes()
    const date = `${year}-${month}-${day} ${hour}:${minute}`
    const params = {
      toUserId: this.data.templateUserId,
      touser: '',
      template_id: 'jIRg4smS2TCc_o1Ef9uBFPX8-2jgY_7ymuxJ0AkK6yQ',
      page: `/pages/publish/detail/detail?id=${this.data.id}`,
      form_id: formId,
      data: [
        {
          key: 'keyword1',
          value: this.data.publishInfo.title
        },
        {
          key: 'keyword2',
          value: this.data.message.params.content
        },
        {
          key: 'keyword3',
          value: date
        }
      ]
    }
  },

  handleMsgBlur() {
    this.setData({
      'message.visible': false
    })
  },

  // 收藏
  handleCollect() {
    const params = {
      publishId: this.data.id
    }
    if (this.data.collectionDown) {
      handleCancelCollect(params).then(() => {
        wx.showToast({
          title: '已取消',
          icon: 'none'
        })
        this.setData({
          collectionDown: !this.data.collectionDown
        })
      })
    } else {
      handleCollect(params).then(() => {
        wx.showToast({
          title: '已收藏',
        })
        this.setData({
          collectionDown: !this.data.collectionDown
        })
      })
    }
  },

  handleToHome(e) {
    const userid = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${userid}`,
    })
  },

  // 录音配置
  audioConfig() {
    // 停止
    innerAudioContext.onStop(() => {
      this.setData({
        isPlaying: false
      })
    });
    // 结束
    innerAudioContext.onEnded(() => {
      this.setData({
        isPlaying: false
      })
    });
    // 错误
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },


  // 录音播放
  handleAudioPlay() {
    const {
      isPlaying,
      publishInfo
    } = this.data
    if (isPlaying) {
      innerAudioContext.stop()
    } else {
      innerAudioContext.src = publishInfo.voiceIntroduce
      innerAudioContext.play()
      this.setData({
        isPlaying: true
      })
    }
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
          const phone = this.data.publishInfo.contactPhone
          wx.makePhoneCall({
            phoneNumber: phone
          })
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const {
      id,
      title,
      mainMedia
    } = this.data.publishInfo
    return {
      title: `#转让#${title}` || '麒麟二手机械',
      path: `pages/publish/detail/detail?id=${id}`,
      imageUrl: '',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      }
    }
  }
})
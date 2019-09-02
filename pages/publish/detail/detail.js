import {
  fetchDetail,
  handleZan,
  handleCollect,
  handleCancelCollect,
  handleMsg
} from '../../../api/publish.js'
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isBindMobile: app.globalData.userInfo && app.globalData.userInfo.phone, // 是否绑定手机号
    publishInfo: null, // 发布信息
    discussInfo: null, // 留言信息
    headimgTest: '../../../icons/headimg.png',
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
    isPlaying: false // 播放状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id || 3
    })
    this.getDetail()
    this.audioConfig()
  },

  // 图片预览
  handlePriviewImg(event) {
    let src = event.currentTarget.dataset.src; //获取data-src
    let imgList = event.currentTarget.dataset.list.map(item => item.file); //获取data-list
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
        likeDown
      })
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
      'message.placeholder': '看对眼就留言，问问更多细节' // 被回复者昵称
    })
  },

  // 回复
  handleReply(e) {
    const { beReplyDiscussId, id, userId, userInfo } = e.currentTarget.dataset.info
    this.setData({
      'message.visible': true,
      'message.params.publishId': this.data.id,
      'message.params.beDiscussId': id, // 回复的动态的ID
      'message.params.floorDiscussId': id, // 主楼id
      'message.params.floorDiscussUserId': userId, // 主楼发布者id
      'message.placeholder': `回复：${userInfo.nickName}`
    })
  },

  // 回复评论
  handleReplyChild(e) {
    const { beReplyDiscussId, id, userId, userInfo } = e.currentTarget.dataset.info
    const { floorid } = e.currentTarget.dataset
    this.setData({
      'message.visible': true,
      'message.params.publishId': this.data.id,
      'message.params.beDiscussId': id, // 回复的动态的ID
      'message.params.floorDiscussId': floorid, // 主楼id
      'message.params.floorDiscussUserId': userId, // 主楼发布者id
      'message.placeholder': `回复：${userInfo.nickName}`
    })
  },

  // 输入留言
  handleMsgInput(e) {
    this.setData({
      'message.params.content': e.detail.value
    })
  },

  // 留言提交
  handleMsgConfirm() {
    const params = this.data.message.params
    handleMsg(params).then(() => {
      this.setData({
        'message.visible': false,
        'message.params.content': ''
      })
      this.getDetail()
    })
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

  handleToHome() {
    const id = this.data.publishInfo.publishUserInfo.id
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${id}`,
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
    const { isPlaying, publishInfo } = this.data
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

  // 授权用户手机号
  handleGetPhone(e) {
    console.log(e)
    if (!e.detail.encryptedData) {
      wx.showModal({
        title: '温馨提示',
        content: '为了避免恶意骚扰，首次在平台进行电话咨询，需要绑定手机号码，平台将对你的隐私进行保护！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
      })
    } else {
      const { phone } = e.currentTarget.dataset
      wx.showModal({
        title: '温馨提示',
        content: '信息由用户自行发布，平台无法杜绝可能存在的风险和瑕疵；电话洽谈时，请仔细核实，谨防诈骗！',
        confirmText: '呼叫',
        success: res => {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: phone
            })
          } else if (res.cancel) {
          }
        }
      })
    }
  },

  // 拨打电话
  handleCall() {
    wx.showModal({
      title: '温馨提示',
      content: '信息由用户自行发布，平台无法杜绝可能存在的风险和瑕疵；电话洽谈时，请仔细核实，谨防诈骗！',
      confirmText: '呼叫',
      success: res => {
        if (res.confirm) {
          const phone = this.data.publishInfo.publishUserInfo.phone
          wx.makePhoneCall({
            phoneNumber: phone
          })
        } else if (res.cancel) {
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
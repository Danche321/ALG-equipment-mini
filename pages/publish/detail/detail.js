import {
  fetchDetail,
  handleZan,
  handleCollect,
  handleCancelCollect
} from '../../../api/publish.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
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
    msgValue: '',
    magVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id || 5
    })
    this.getDetail()
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
  handleMsgShow() {
    this.setData({
      msgVisible: true
    })
  },


  handleMsgInput(e) {
    this.setData({
      msgValue: e.detail.value
    })
  },

  handleMsgBlur() {
    this.setData({
      msgVisible: false
    })
  },

  // 留言提交
  handleMsgConfirm() {
    console.log(this.data.msgValue)
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
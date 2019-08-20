import { fetchDetail } from '../../../api/publish.js'
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
    messageList: [{
      headimg: '',
      nickname: '长城',
      time: '4小时前',
      content: '能不能再便宜点，感觉机器挺好的，就是价格有点贵了呢？',
      children: [{
        headimg: '',
        nickname: '长城',
        time: '10分钟前',
        toName: '高龙',
        content: '这已经是最低价格了，不能再低了。'
      }, {
        headimg: '',
        nickname: '长城',
        time: '10分钟前',
        toName: '高龙',
        content: '这已经是最低价格了，不能再低了。'
      }]
    }, {
      headimg: '',
      nickname: '长城',
      time: '4小时前',
      content: '能不能再便宜点，感觉机器挺好的，就是价格有点贵了呢？',
      children: [{
        headimg: '',
        nickname: '长城',
        time: '10分钟前',
        toName: '高龙',
        content: '这已经是最低价格了，不能再低了。'
      }, {
        headimg: '',
        nickname: '长城',
        time: '10分钟前',
        toName: '高龙',
        content: '这已经是最低价格了，不能再低了。'
      }]
    }]
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

  getDetail() {
    const params = {
      publishId: this.data.id || 4
    }
    fetchDetail(params).then(res => {
      const { publish, discuss } = res.data
      this.setData({
        publishInfo: publish,
        discussInfo: discuss
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getDetail()
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
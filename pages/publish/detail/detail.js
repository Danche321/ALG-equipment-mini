// pages/publish/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimgTest: '../../../icons/headimg.png',
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    interval: 3000,
    duration: 100,
    swiperCurrent: 0,
    title: '八成新挖掘机刚用两年，现在转让，价格实惠欢迎购买，刚用两年八成新的挖掘机。',
    tags: ['挖掘机', '原价：￥9899', '2017年'],
    desc: '八成新挖掘机刚用两年，现在转让，价格实惠欢迎购，刚用两年八成新的挖掘机便宜转让了啊，买到就是赚到。刚用两年八成新的挖掘机便宜转让了啊。',
    zanNum: 68,
    readNum: 980,
    totalMsg: 29,
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
    let imgList = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  // banner滑动
  handleSwiperChange(e) {
    console.log(e)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
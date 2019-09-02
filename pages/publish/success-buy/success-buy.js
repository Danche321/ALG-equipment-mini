Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    isOverShare: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { title } = this.data
    return {
      title: title || '麒麟二手机械',
      path: 'pages/publish/list-buy/list-buy',
      imageUrl: '', //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})
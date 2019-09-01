Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: '',
    imgUrl: '',
    isOverShare: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { id, title, imgUrl } = JSON.parse(options.params)
    this.setData({
      id,
      title,
      imgUrl
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const { id, title, imgUrl } = this.data
    return {
      title: title || '麒麟二手机械',
      path: `pages/publish/detail/detail?id=${id}`,
      imageUrl: imgUrl, //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      success: function(res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})
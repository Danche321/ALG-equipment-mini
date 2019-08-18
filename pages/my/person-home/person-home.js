// pages/my/person-home/person-home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    publishList: [
      {
        day: '今天',
        items: [
          {
            img: [],
            title: '八成新挖掘机出售，八成新挖掘机出售啦，便宜卖八成新挖掘机啦，价格便宜的八成新挖掘机八成新挖掘机出售，八成新挖掘机出售啦，便宜卖八成新挖掘机啦，价格便宜的八成新挖掘机.'
          }, {
            img: [],
            title: '八成新挖掘机出售，八成'
          }
        ]
      }, {
        day: '今天',
        items: [
          {
            img: [],
            title: '八成新挖掘机出售，八成新挖掘机出售啦，便宜卖八成新挖掘机啦，价格便宜的八成新挖掘机八成新挖掘机出售，八成新挖掘机出售啦，便宜卖八成新挖掘机啦，价格便宜的八成新挖掘机.'
          }, {
            img: [],
            title: '八成新挖掘机出售，八成'
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        const sys = wx.getSystemInfoSync()
        const statusHeight = sys.statusBarHeight
        this.setData({
          statusBarHeight: statusHeight
        })
      },
      fail: () => { }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
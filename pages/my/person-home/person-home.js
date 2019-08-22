import { fetchMyHome } from '../../../api/my.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    publishList: [],
    currentFlagId: -1, // 临界点id
    followed: false, // 是否已关注
    hasMore: true, // 是否有下一页
    whoInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setHeaderConfig()
    this.getList()
  },

  handleBack() {
    wx.navigateBack({
      delta: 2,
    })
  },

  // 获取信息
  getList(isFirst) {
    const params = {
      whoId: 1,
      baseSize: isFirst || this.data.currentFlagId
    }
    fetchMyHome(params).then(res => {
      const { publishInHp, followed, whoInfo } = res.data
      this.setData({
        publishList: publishInHp.items,
        followed,
        whoInfo,
        currentFlagId: publishInHp.currentFlagId,
        hasMore: publishInHp.hasMore
      })
      if (isFirst) wx.stopPullDownRefresh()
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
  
  onPullDownRefresh: function () {
    this.getList(-1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
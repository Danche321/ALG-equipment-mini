import { fetchUserInfo, fetchMyHomePublish } from '../../../api/my.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    userInfo: null,
    listData: [],
    params: {
      whoId: '',
      pageNum: 1,
      pageSize: 10
    },
    hasNextPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.data.params.whoId = id
    this.setHeaderConfig()
    this.getUserInfo()
    this.getList()
  },

  handleBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  // 获取个人资料
  getUserInfo() {
    fetchUserInfo().then(res => {
      this.setData({
        userInfo: res.data
      })
    })
  },

  // 获取发布列表
  getList(isFirst) {
    const params = this.data.params
    if (isFirst) this.data.params.pageNum = 1
    fetchMyHomePublish(params).then(res => {
      const { items, hasNextPage } = res.data
      this.setData({
        listData: items,
        hasNextPage
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
    this.getList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.data.params.pageNum++
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
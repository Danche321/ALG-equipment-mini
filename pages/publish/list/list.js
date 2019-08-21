const app = getApp()
import { fetchPublish } from '../../../api/publish.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    titleBar: {
      height: '',
      top: '',
      width: '',
      left: ''
    },
    publishList: [],
    publishParams: {
      pageNum: 1,
      pageSize: 10
    },
    publishList: [],
    hasNextPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeaderConfig()
    this.getList()
  },

  getHeaderConfig() {
    wx.getSystemInfo({
      success: (res) => {
        const sys = wx.getSystemInfoSync()
        const menu = wx.getMenuButtonBoundingClientRect()
        const statusHeight = sys.statusBarHeight
        const titleHeight = menu.height
        const titleRowWidth = sys.right - menu.right
        const titleColumnHeight = menu.top - sys.statusBarHeight
        this.setData({
          statusBarHeight: statusHeight,
          'titleBar.height': titleHeight,
          'titleBar.top': titleColumnHeight,
          'titleBar.left': sys.screenWidth - menu.right,
          'titleBar.width': sys.screenWidth - (sys.screenWidth - menu.right) * 3 - menu.width
        })
      },
      fail: () => { }
    })
  },

  // 发布列表
  getList(isFirst) {
    const params = this.data.publishParams
    if (isFirst) this.data.publishParams.pageNum = 1
    fetchPublish(params).then(res => {
      const { items, hasNextPage } = res.data
      let resList = []
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.publishList, ...items]
      }
      this.setData({
        publishList: resList,
        hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
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
    this.getList()
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
    if (this.data.isBottom) return
    this.setData({
      page: ++this.data.page,
      size: 10,
    });
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
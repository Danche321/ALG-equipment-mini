import { fetchUserInfo, fetchMyHomePublish } from '../../../api/my.js'
import { fetchBuyList } from '../../../api/buy.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    userInfo: null,
    sale: {
      listData: [],
      params: {
        whoId: '',
        pageNum: 1,
        pageSize: 10
      },
      hasNextPage: false
    },
    buy: {
      listData: [],
      params: {
        whoId: '',
        pageNum: 1,
        pageSize: 10
      },
      hasNextPage: false
    },
    activeTab: 'sale'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.data.sale.params.whoId = id || 1
    this.setHeaderConfig()
    this.getUserInfo()
    this.getSaleList()
    this.getBuyList()
  },

  // tab切换
  handleTabChange(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      activeTab: type
    })
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
  getSaleList(isFirst) {
    const params = this.data.sale.params
    if (isFirst) this.data.sale.params.pageNum = 1
    fetchMyHomePublish(params).then(res => {
      const { items, hasNextPage } = res.data
      this.setData({
        'sale.listData': items,
        'sale.hasNextPage': hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  // 获取求购列表
  getBuyList(isFirst) {
    const params = this.data.buy.params
    fetchBuyList(params).then(res => {
      const { items, hasNextPage } = res.data
      let resList = []
      items.map(item => {
        item.locationText = `${item.locationDetail.provinceName}·${item.locationDetail.cityName}`
        item.tags = [item.newOldLevel, item.categoryFirstName, item.categorySecondName]
        return item
      })
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.buy.listData, ...items]
      }
      this.setData({
        'buy.listData': resList,
        'buy.hasNextPage': hasNextPage
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
    this.getSaleList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.sale.hasNextPage) {
      this.data.sale.params.pageNum++
      this.getSaleList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
const app = getApp()
import {
  fetchHotCategory
} from '../../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostList: [],
    historyList: [],
    searchText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHotList()
    this.getHistoryList()
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
  onUnload: function(e) {},

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

  /**e
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 输入框改变
  handleInputChange(e) {
    const val = e.detail.value
    this.setData({
      searchText: val
    })
  },

  // 获取热门类目
  getHotList() {
    fetchHotCategory().then(res => {
      const {
        data
      } = res
      this.setData({
        hostList: data
      })
    })
  },
  // 获取历史搜索
  getHistoryList() {
    wx.getStorage({
      key: 'searchHistoryList',
      success: res => {
        this.setData({
          historyList: [...new Set(JSON.parse(res.data))]
        })
      }
    })
  },
  // 搜索关键字
  handleSearch() {
    const searchText = this.data.searchText
    wx.setStorage({
      key: "searchHistoryList",
      data: JSON.stringify([...this.data.historyList, searchText])
    })
    app.globalData.searchText = searchText
    wx.switchTab({
      url: `/pages/publish/list/list`,
    })
  },
  // 搜索类目
  handleSearchCategory(e) {
    const {
      id,
      name
    } = e.currentTarget.dataset
    app.globalData.searchCategoryFirstId = id
    app.globalData.searchCategoryFirstName = name
    app.globalData.searchCategorySecondId = ''
    app.globalData.searchCategorySecondName = ''
    wx.switchTab({
      url: `/pages/publish/list/list`,
    })
  }
})
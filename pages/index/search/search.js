const app = getApp()
import { fetchHotCategory } from '../../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostList: [
      {name: '一点点', id: '1'},
      {name: '一点点', id: '1'},
      {name: '一点点', id: '1'},
      {name: '一点点', id: '1'},
      {name: '一点点', id: '1'},
      {name: '一点点', id: '1'},
      {name: '一点点', id: '1'}
    ],
    searchText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotList()
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
  onUnload: function (e) {
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

  /**e
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      const { data } = res
      this.setData({
        hostList: data
      })
    })
  },
  // 搜索关键字
  handleSearch() {
    app.globalData.searchText = this.data.searchText
    wx.switchTab({
      url: `/pages/publish/list/list`,
    })
  },
  // 搜索类目
  handleSearchCategory(e) {
    const { id, name } = e.currentTarget.dataset
    app.globalData.searchCategoryFirstId = id
    app.globalData.searchCategoryFirstName = name
    app.globalData.searchCategorySecondId = ''
    app.globalData.searchCategorySecondName = ''
    wx.switchTab({
      url: `/pages/publish/list/list`,
    })
  }
})
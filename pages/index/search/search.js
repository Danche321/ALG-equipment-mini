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
  // 点击历史搜索
  handleHistorySearch(e) {
    const { keyword } = e.currentTarget.dataset
    app.globalData.searchText = keyword
    wx.switchTab({
      url: `/pages/publish/list/list`,
    })
  },
  // 清空历史搜索
  handleClear() {
    wx.showModal({
      title: '提示',
      content: '清空历史搜索？',
      success: res => {
        if (res.confirm) {
          wx.removeStorage({
            key: 'searchHistoryList',
            success: res => {
              this.setData({
                historyList: []
              })
              wx.showToast({
                title: '已清空',
              })
            }
          })
        } else if (res.cancel) {
        }
      }
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
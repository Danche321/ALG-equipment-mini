const app = getApp()
import {
  fetchPublish
} from '../../../api/publish.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publishList: [],
    publishParams: {
      pageNum: 1,
      pageSize: 10,
      searchText: '',
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      categoryFirstId: '',
      categorySecondId: ''
    },
    publishList: [],
    hasNextPage: true,
    // 选择机型组件
    selectCategoryVisible: false,
    // 选中的分类名称
    searchCategoryFirstName: '',
    searchCategorySecondName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(1)
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
    const {
      searchText,
      searchCategoryFirstId,
      searchCategoryFirstName
    } = app.globalData
    if (this.data.publishParams.searchText !== searchText || this.data.publishParams.categoryFirstId !== searchCategoryFirstId) {
      this.getList(1)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasNextPage) {
      this.data.publishParams.pageNum++
        this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  handleInputChange(e) {
    this.setData({
      'publishParams.searchText': e.detail.value
    })
  },

  // 搜索
  handleSearch(e) {
    this.getList(1)
  },

  // 清空关键词
  handleClearSearchText() {
    this.setData({
      'publishParams.searchText': '',
    })
    app.globalData.searchText = ''
    this.getList(1)
  },

  //清空一级分类
  handleClearCategoryFirst() {
    this.setData({
      'publishParams.categoryFirstId': '',
      'searchCategoryFirstName': '',
    })
    app.globalData.searchCategoryFirstId = ''
    app.globalData.searchCategoryFirstName = ''
    this.getList(1)
  },

  //清空二级分类
  handleClearCategorySecond() {
    this.setData({
      'publishParams.categorySecondId': '',
      'searchCategorySecondName': '',
    })
    app.globalData.searchCategorySecondId = ''
    app.globalData.searchCategorySecondName = ''
    this.getList(1)
  },
  // 发布列表
  getList(isFirst) {
    const {
      searchText,
      searchCategoryFirstId,
      searchCategoryFirstName,
      searchCategorySecondId,
      searchCategorySecondName
    } = app.globalData
    this.setData({
      'publishParams.searchText': searchText,
      'publishParams.categoryFirstId': searchCategoryFirstId,
      'publishParams.categorySecondId': searchCategorySecondId,
      searchCategoryFirstName: searchCategoryFirstName,
      searchCategorySecondName: searchCategorySecondName
    })
    const params = this.data.publishParams
    if (isFirst) this.data.publishParams.pageNum = 1
    fetchPublish(params).then(res => {
      const {
        items,
        hasNextPage
      } = res.data
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

  // 显示机型选择弹窗
  handleShowCategory() {
    this.setData({
      selectCategoryVisible: true
    })
  },

  // 选择机型确定
  handleCategoryConfirm() {
    this.setData({
      selectCategoryVisible: false
    })
    const {
      searchCategoryFirstId,
      searchCategorySecondId
    } = app.globalData
    const {
      categoryFirstId,
      categorySecondId
    } = this.data.publishParams
    if (categoryFirstId !== searchCategoryFirstId || categorySecondId !== searchCategorySecondId) {
      this.getList(1)
    }
  },

  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
    })
  },

  // 跳转搜索
  handleToSearch() {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },

  // 选择区域
  handleSwitchArea() {
    wx.navigateTo({
      url: '/pages/index/switchcity/switchcity',
    })
  }
})
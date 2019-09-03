import {
  fetchPublish
} from '../../../api/publish.js'
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
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
    searchCategorySecondName: '',
    // 选择城市组件
    selectCityVisible: false,
    provinceName: '',
    cityName: '',
    marginTop: '',
    activePlayingId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.audioConfig() // 监听录音状态
    this.getList(1)
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
    } else if (app.globalData.refreshSearch) {
      app.globalData.refreshSearch = false
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
    const query = wx.createSelectorQuery();
    query.select('.page-search').boundingClientRect(rect => {
      this.setData({
        marginTop: rect.height
      })
    }).exec();
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
  // 清空省份
  handleClearProvince() {
    this.setData({
      'publishParams.provinceCode': '',
      'provinceName': ''
    })
    this.getList(1)
  },
  // 清空城市
  handleClearCity() {
    this.setData({
      'publishParams.cityCode': '',
      'cityName': ''
    })
    this.getList(1)
  },

  // 显示机型选择弹窗
  handleShowCategory() {
    this.setData({
      selectCategoryVisible: true
    })
  },

  // 选择机型确定
  handleCategoryConfirm(e) {
    this.setData({
      selectCategoryVisible: false
    })
    const { firstid, firstName, secondid, secondName } = JSON.parse(e.detail)
    const {
      searchCategoryFirstId,
      searchCategorySecondId
    } = app.globalData
    const {
      categoryFirstId,
      categorySecondId
    } = this.data.publishParams
    if (firstid !== searchCategoryFirstId || secondid !== searchCategorySecondId) {
      app.globalData.searchCategoryFirstId = firstid
      app.globalData.searchCategoryFirstName = firstName
      app.globalData.searchCategorySecondId = secondid
      app.globalData.searchCategorySecondName = secondName
      this.getList(1)
    }
  },

  // 显示城市选择弹窗
  handleShowCity() {
    this.setData({
      selectCityVisible: true
    })
  },

  // 城市选择确定
  handleCityConfirm(e) {
    this.setData({
      selectCityVisible: false
    })
    if (!e.detail) return false
    const provinceId = JSON.parse(e.detail).first.id
    const provinceName = JSON.parse(e.detail).first.fullname
    const cityId = JSON.parse(e.detail).second.id
    const cityName = JSON.parse(e.detail).second.fullname
    const { provinceCode, cityCode } = this.data.publishParams
    this.setData({
      provinceName: provinceId ? provinceName : '',
      cityName: cityId ? cityName : ''
    })
    if (provinceId !== provinceCode || cityId !== cityCode) {
      this.setData({
        'publishParams.provinceCode': provinceId,
        'publishParams.cityCode': cityId
      })
      this.getList(1)
    }
  },

  // 录音配置
  audioConfig() {
    // 停止
    innerAudioContext.onStop(() => {
      this.setData({
        activePlayingId: ''
      })
    });
    // 结束
    innerAudioContext.onEnded(() => {
      this.setData({
        activePlayingId: ''
      })
    });
    // 错误
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  // 播放录音
  handleAudioPlay(e) {
    const { src, id } = e.currentTarget.dataset
    const { activePlayingId } = this.data
    if (activePlayingId === id) {
      innerAudioContext.stop()
    } else {
      innerAudioContext.src = src
      innerAudioContext.play()
      this.setData({
        activePlayingId: id
      })
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
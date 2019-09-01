import { fetchBanner, fetchAllCategory } from '../../../api/index.js'
import { fetchPublish } from '../../../api/publish.js'
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 4000,
    duration: 100,
    bannerList: [],
    categoryList: [],
    publishParams: {
      pageNum: 1,
      pageSize: 10
    },
    publishList: [],
    hasNextPage: true,
    activePlayingId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanner()
    this.getCategory()
    this.getPublish()
    this.audioConfig() // 监听录音状态
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getBanner()
    this.getCategory()
    this.getPublish(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.data.publishParams.pageNum++
      this.getPublish()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // banner列表
  getBanner() {
    const params = {
      count: 6
    }
    fetchBanner(params).then(res => {
      this.setData({
        bannerList: res.data
      })
    })
  },

  // 分类
  getCategory() {
    fetchAllCategory().then(res => {
      const { data } = res
      let resArr = []
      for (let i = 0; i < data.length; i += 10) {
        resArr.push(data.slice(i, i + 10))
      }
      this.setData({
        categoryList: resArr
      })
    })
  },

  // 发布列表
  getPublish(isFirst) {
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

  handleToSearch() {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  handleSwitchCity() {
    wx.navigateTo({
      url: '/pages/index/switchcity/switchcity',
    })
  },
})
import {
  fetchBanner,
  fetchAllCategory
} from '../../../api/index.js'
import {
  fetchPublish
} from '../../../api/publish.js'
let innerAudioContext = wx.createInnerAudioContext()
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    interval: 4000,
    duration: 100,
    bannerList: [],
    categoryList: [],
    publishParams: {
      pageNum: 1,
      pageSize: 10,
      isDownShelf: 1,
      locationProvinceCode: '' // 定位省份
    },
    publishList: [],
    hasNextPage: true,
    activePlayingId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLocation()
    this.getBanner()
    this.getCategory()
    this.audioConfig() // 监听录音状态
  },

  onShow: function() {
    if (app.globalData.refreshHome) {
      app.globalData.refreshHome = false
      this.getPublish(1)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    innerAudioContext.stop()
    this.setData({
      activePlayingId: ''
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getBanner()
    this.getCategory()
    this.getPublish(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasNextPage) {
      this.data.publishParams.pageNum++
        this.getPublish()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  // 获取定位城市
  getLocation() {
    // 实例化API核心类
    const qqmapsdk = new QQMapWX({
      key: '5FDBZ-CESCD-5XA4F-HQLMD-WJLA7-LDB6W'
    })
    qqmapsdk.reverseGeocoder({
      complete: res => {
        console.log(res)
        if (res.status === 0) {
          const {
            adcode
          } = res.result.ad_info
          this.setData({
            'publishParams.locationProvinceCode': `${adcode.substring(0, 2)}0000`
          })
          this.getPublish()
        } else {
          this.getPublish()
        }
      }
    })
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
      const {
        data
      } = res
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


  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
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
  },

  // 录音配置
  audioConfig() {
    // 停止
    innerAudioContext.onStop(() => {});
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
    const {
      src,
      id
    } = e.currentTarget.dataset
    console.log(id)
    const {
      activePlayingId
    } = this.data
    if (activePlayingId === id) {
      innerAudioContext.stop()
      this.setData({
        activePlayingId: ''
      })
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
  handleToUserHome(e) {
    const id = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${id}`,
    })
  },
  //banner跳转
  handleBannerTo(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }
})
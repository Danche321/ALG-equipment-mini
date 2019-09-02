import {
  fetchPersonHome,
  fetchMyHomePublish
} from '../../../api/my.js'
import {
  fetchMyBuyList
} from '../../../api/buy.js'
import {
  handleFocus,
  handleCancleFocus
} from '../../../api/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    whoId: '', // 主页者id
    userId: '', // 当前用户id
    userInfo: null,
    followed: false, // 是否关注
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
        userId: '',
        shelfStatus: 1,
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
  onLoad: function(options) {
    const whoId = options.id || 1
    this.setData({
      whoId: whoId,
      userId: app.globalData.userInfo && app.globalData.userInfo.id,
      'sale.params.whoId': whoId,
      'buy.params.userId': whoId
    })
    this.setHeaderConfig()
    this.getHomeInfo()
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

  // banner滑动
  handleSwiperChange(e) {
    const index = e.detail.current
    this.setData({
      activeTab: index === 0 ? 'sale' : 'buy'
    })
  },

  handleBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  // 获取个人主页信息
  getHomeInfo() {
    const params = {
      userId: this.data.userId, // 当前用户id
      whoId: this.data.whoId, // 主页者id
      baseSize: 1
    }
    fetchPersonHome(params).then(res => {
      const {
        whoInfo,
        followed
      } = res.data
      this.setData({
        userInfo: whoInfo,
        followed: followed
      })
    })
  },

  // 获取发布列表
  getSaleList(isFirst) {
    const params = this.data.sale.params
    if (isFirst) this.data.sale.params.pageNum = 1
    fetchMyHomePublish(params).then(res => {
      const {
        items,
        hasNextPage
      } = res.data
      let resList = []
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.sale.listData, ...items]
      }
      this.setData({
        'sale.listData': resList,
        'sale.hasNextPage': hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  // 获取求购列表
  getBuyList(isFirst) {
    const params = this.data.buy.params
    fetchMyBuyList(params).then(res => {
      const {
        items,
        hasNextPage
      } = res.data
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
      fail: () => {}
    })
  },

  // 转让信息滚动到底部
  saleReachBottom() {
    if (this.data.sale.hasNextPage) {
      this.data.sale.params.pageNum++
        this.getSaleList()
    }
  },

  // 求购信息滚动到底部
  buyReachBottom() {
    if (this.data.buy.hasNextPage) {
      this.data.buy.params.pageNum++
        this.getBuyList()
    }
  },

  // 拨打电话
  handleCall(e) {
    wx.showModal({
      title: '温馨提示',
      content: '信息由用户自行发布，平台无法杜绝可能存在的风险和瑕疵；电话洽谈时，请仔细核实，谨防诈骗！',
      confirmText: '呼叫',
      success: res => {
        if (res.confirm) {
          const phone = e.currentTarget.dataset.phone
          wx.makePhoneCall({
            phoneNumber: phone
          })
        } else if (res.cancel) {}
      }
    })
    // const currentUserPhone = app.globalData.userInfo.phone
    // console.log(currentUserPhone)
  },

  // 关注
  handleFocus() {
    const { userId, whoId } = this.data
    const params = `?userId=${userId}&objectId=${whoId}`
    handleFocus(params).then(() => {
      wx.showToast({
        title: '已关注',
      })
      this.setData({
        followed: true
      })
    })
  },

  // 取消关注
  handleCancleFocus() {
    const { userId, whoId } = this.data
    const params = `?userId=${userId}&objectId=${whoId}`
    handleCancleFocus(params).then(() => {
      wx.showToast({
        title: '已取消',
        icon: 'none'
      })
      this.setData({
        followed: false
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.activeTab === 'sale') {
      this.getSaleList(1)
    } else {
      this.getBuyList(1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
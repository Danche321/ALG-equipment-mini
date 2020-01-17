const app = getApp()
import {
  fetchBuyList
} from '../../../api/buy.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOverShare: true,
    ICON_URL: app.globalData.ICON_URL,
    listData: [],
    params: {
      pageNum: 1,
      pageSize: 10,
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      categoryFirstId: '',
      categorySecondId: '',
      brandId: ''
    },
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
    // 选择品牌组件
    selectBrandVisible: false,
    brandName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(1)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.refreshBuy) {
      this.getList(1)
      app.globalData.refreshBuy = false
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasNextPage) {
      this.data.params.pageNum++
        this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 发布列表
  getList(isFirst) {
    const params = this.data.params
    if (isFirst) this.data.params.pageNum = 1
    const query = wx.createSelectorQuery();
    query.select('.m-page-filter').boundingClientRect(rect => {
      this.setData({
        marginTop: rect.height
      })
    }).exec();
    fetchBuyList(params).then(res => {
      const {
        items,
        hasNextPage
      } = res.data
      let resList = []
      items.map(item => {
        let locationText
        if (item.locationDetail.provinceName === item.locationDetail.cityName || !item.locationDetail.cityName) {
          locationText = item.locationDetail.provinceName
        } else {
          locationText = `${item.locationDetail.provinceName}·${item.locationDetail.cityName}`
        }
        item.locationText = locationText
        item.tags = [item.newOldLevel, item.categoryFirstName, item.categorySecondName]
      })
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.listData, ...items]
      }
      this.setData({
        listData: resList,
        hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  //清空一级分类
  handleClearCategoryFirst() {
    this.setData({
      'params.categoryFirstId': '',
      'searchCategoryFirstName': '',
    })
    app.globalData.searchCategoryFirstId = ''
    app.globalData.searchCategoryFirstName = ''
    this.getList(1)
  },

  //清空二级分类
  handleClearCategorySecond() {
    this.setData({
      'params.categorySecondId': '',
      'searchCategorySecondName': '',
    })
    app.globalData.searchCategorySecondId = ''
    app.globalData.searchCategorySecondName = ''
    this.getList(1)
  },
  // 清空省份
  handleClearProvince() {
    this.setData({
      'params.provinceCode': '',
      'provinceName': ''
    })
    this.getList(1)
  },
  // 清空城市
  handleClearCity() {
    this.setData({
      'params.cityCode': '',
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
    if (!e.detail) return false
    const {
      firstid,
      firstName,
      secondid,
      secondName
    } = JSON.parse(e.detail)
    const {
      categoryFirstId,
      categorySecondId
    } = this.data.params
    if (firstid !== categoryFirstId || secondid !== categorySecondId) {
      this.setData({
        'params.categoryFirstId': firstid,
        'params.categorySecondId': secondid,
        searchCategoryFirstName: firstName,
        searchCategorySecondName: secondName
      })
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
    const {
      provinceCode,
      cityCode
    } = this.data.params
    this.setData({
      provinceName: provinceId ? provinceName : '',
      cityName: cityId ? cityName : ''
    })
    if (provinceId !== provinceCode || cityId !== cityCode) {
      this.setData({
        'params.provinceCode': provinceId,
        'params.cityCode': cityId
      })
      this.getList(1)
    }
  },

  // 选择品牌组件
  handleBrandConfirm(e) {
    this.setData({
      selectBrandVisible: false
    })
    if (!e.detail) return false
    const { id, name } = JSON.parse(e.detail)
    console.log(id, name)
    this.setData({
      'params.brandId': id,
      brandName: name
    })
    this.getList(1)
  },

  handleShowBrand() {
    this.setData({
      selectBrandVisible: !this.data.selectBrandVisible
    })
  },

  handleClearBrand() {
    this.setData({
      'params.brandId': '',
      'brandName': ''
    })
    this.getList(1)
  },

  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail-buy/detail-buy?id=${id}`,
    })
  }
})
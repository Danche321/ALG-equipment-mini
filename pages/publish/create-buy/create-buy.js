import {
  handleCreateBuy
} from '../../../api/buy.js'
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
let qqmapsdk

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      title: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      contactPhone: '',
      newOldLevel: '不限制',
      firstCategoryId: '',
      secondCategoryId: '',
      creator: 1,
      // 不需要的
      content: '11',
      areaCode: '11',
      areaName: '11'
    },
    yearTags: ['1年内', '1～3年', '3~5年', '不限制'],
    selectCategoryVisible: false, // 选择机型组件
    showCategoryName: '', // 分类名称
    selectCityVisible: false // 选择城市组件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '5FDBZ-CESCD-5XA4F-HQLMD-WJLA7-LDB6W'
    })
    this.getLocation()
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
  onUnload: function() {

  },

  // 发布
  handleSubmit() {
    const {
      title,
      provinceCode,
      contactPhone,
      firstCategoryId
    } = this.data.params
    if (!title) return wx.showToast({
      title: '请填写描述',
      icon: 'none'
    })
    if (!provinceCode) return wx.showToast({
      title: '请选择交易地点',
      icon: 'none'
    })
    if (!contactPhone) return wx.showToast({
      title: '请填写联系方式',
      icon: 'none'
    })
    if (!firstCategoryId) return wx.showToast({
      title: '请选择机型',
      icon: 'none'
    })
    handleCreateBuy(this.data.params).then(() => {
      wx.showModal({
        title: '发布成功'
      })
    })
  },

  // 获取定位城市
  getLocation() {
    qqmapsdk.reverseGeocoder({
      success: res => {
        const {
          adcode,
          province,
          city
        } = res.result.ad_info
        this.setData({
          'params.provinceCode': `${adcode.substring(0, 2)}0000`,
          'params.provinceName': province,
          'params.cityCode': adcode,
          'params.cityName': city
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
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
    let trueSecondName = secondid ? `·${secondName}` : ''
    this.setData({
      'params.firstCategoryId': firstid,
      'params.secondCategoryId': secondid,
      showCategoryName: `${firstName}${trueSecondName}`
    })
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
    let trueCityName = cityId ? `·${cityName}` : ''
    this.setData({
      'params.provinceCode': provinceId,
      'params.provinceName': provinceName,
      'params.cityCode': cityId,
      'params.cityName': trueCityName
    })
  },

  // 新旧程度
  handleYearChange(e) {
    const data = e.currentTarget.dataset.item
    this.setData({
      'params.newOldLevel': data
    })
  },

  handleTitleChange(e) {
    this.setData({
      'params.title': e.detail.value
    })
  },

  handlePhoneChange(e) {
    this.setData({
      'params.contactPhone': e.detail.value
    })
  },
})
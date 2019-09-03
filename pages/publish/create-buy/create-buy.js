import {
  handleCreateBuy
} from '../../../api/buy.js'
import { handleBindPhone, fetchWxPhone } from '../../../api/common.js'
import { checkPhone } from '../../../utils/rules.js'
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
let qqmapsdk
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindMobile: '', // 是否绑定手机号
    params: {
      creator: app.globalData.userInfo && app.globalData.userInfo.id,
      title: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      contactPhone: '',
      newOldLevel: '不限制',
      firstCategoryId: '',
      secondCategoryId: ''
    },
    yearTags: ['1年内', '1～3年', '3~5年', '不限制'],
    selectCategoryVisible: false, // 选择机型组件
    showCategoryName: '', // 分类名称
    selectCityVisible: false, // 选择城市组件
    updatePhoneDialog: { // 修改手机号弹窗
      visible: false,
      value: '', // 修改联系方式的值
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '5FDBZ-CESCD-5XA4F-HQLMD-WJLA7-LDB6W'
    })
    const phone = app.globalData.userInfo && app.globalData.userInfo.phone
    this.setData({
      bindMobile: phone,
      'params.contactPhone': phone
    })
    this.getLocation()
  },

  // 授权用户手机号
  handleGetPhone(e) {
    if (!e.detail.encryptedData) { // 拒绝授权
      wx.showModal({
        title: '温馨提示',
        content: '为了保证信息的真实性，首次在平台进行信息发布，需要绑定手机号码',
        showCancel: false
      })
    } else {
      // 登录获取code
      wx.login({
        success: res => {
          const params = {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
          fetchWxPhone(params).then(res2 => {
            const phone = 13328202442
            this.handleBindPhone(phone)
          })
        }
      })
    }
  },

  // 绑定手机号
  handleBindPhone(phone) {
    const userId = app.globalData.userInfo && app.globalData.userInfo.id
    this.setData({
      bindMobile: phone,
      'params.contactPhone': phone
    })
    const params = `?userId=${userId}&phone=${phone}`
    handleBindPhone(params).then(() => {
      app.globalData.userInfo.phone = phone
      wx.setStorage({
        key: "userInfo",
        data: JSON.stringify(app.globalData.userInfo)
      })
      this.handleSubmit()
    })
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
    wx.showModal({
      title: '温馨提示',
      content: '请确保信息真实性，否则平台将进行删除并冻结您的账号！',
      confirmText: '确定发布',
      cancelColor: '#999',
      success: res => {
        if (res.confirm) {
          handleCreateBuy(this.data.params).then(() => {
            app.globalData.refreshBuy = true
            const title = `【求购】${this.data.params.title}`
            wx.redirectTo({
              url: `/pages/publish/success-buy/success-buy?title=${title}`,
            })
          })
        }
      }
    })
  },

  // 获取定位城市
  getLocation() {
    qqmapsdk.reverseGeocoder({
      success: res => {
        const {
          adcode,
          province,
          city,
          city_code
        } = res.result.ad_info
        const showArea = province === city ? province : `${province}·${city}`
        this.setData({
          'params.provinceCode': `${adcode.substring(0, 2)}0000`,
          'params.provinceName': province,
          'params.cityCode': city_code.substring(3,9),
          'params.cityName': city,
          showAreaName: showArea
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
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
    this.setData({
      'params.provinceCode': provinceId,
      'params.provinceName': provinceName,
      'params.cityCode': cityId,
      'params.cityName': cityId ? cityName : '',
      showAreaName: cityId ? `${provinceName}·${cityName}` : provinceName
    })
  },

  // 新旧程度
  handleYearChange(e) {
    const data = e.currentTarget.dataset.item
    this.setData({
      'params.newOldLevel': data
    })
  },

  // 修改手机号弹窗显示
  handleUpdatePhone() {
    this.setData({
      'updatePhoneDialog.visible': true
    })
  },

  // 修改手机号输入
  handlePhoneInput(e) {
    const phone = e.detail.value
    this.setData({
      'updatePhoneDialog.value': phone
    })
  },

  // 修改手机号取消
  updatePhoneCancle() {
    this.setData({
      'updatePhoneDialog.visible': false
    })
  },

  // 修改手机号确认
  updatePhoneConfirm() {
    const value = this.data.updatePhoneDialog.value
    if (!value) {
      this.setData({
        'updatePhoneDialog.visible': false
      })
    } else {
      if (!checkPhone(value)) {
        return wx.showToast({
          title: '手机号码格式错误',
          icon: 'none'
        })
      }
      this.setData({
        'params.contactPhone': value,
        'updatePhoneDialog.visible': false
      })
    }
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
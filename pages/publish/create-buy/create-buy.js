import {
  handleCreateBuy,
  handleUpdateBuy
} from '../../../api/buy.js'
import {
  handleBindPhone,
  fetchWxPhone
} from '../../../api/common.js'
import {
  checkPhone
} from '../../../utils/rules.js'
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
const app = getApp()

const leftPrices = []
for (let i = 5; i <= 85; i += 5) {
  leftPrices.push(i)
}
const leftYears = []
const rightYears = []
for (let i = 1999; i <= 2018; i++) {
  leftYears.unshift(i)
}
for (let i = 2000; i <= 2019; i++) {
  rightYears.unshift(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    code: '', // 授权手机号前的登录code
    bindMobile: '', // 是否绑定手机号
    params: {
      id: '', // 编辑的时候用
      creator: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      contactPhone: '',
      firstCategoryId: '',
      secondCategoryId: '',
      expectedPrice: '',
      usageHours: '',
      yearLimitNum: '',
      hasInvoice: 0,
      hasCertificate: 0,
      contact: '',
      remark: ''
    },
    pricePickerIndex: [0, 0],
    priceArray: [
      ['面议', ...leftPrices],
      []
    ],
    hourPickerIndex: 0,
    hourArray: ['不限', '2000小时以内', '2000-4000小时', '4000-6000小时', '6000-8000小时', '8000以上'],
    yearPickerIndex: [0, 0],
    yearArray: [
      leftYears, rightYears
    ],
    selectCategoryVisible: false, // 选择机型组件
    showCategoryName: '', // 分类名称
    shareCategoryName: '', // 分享的分类名称
    selectCityVisible: false, // 选择城市组件
    showAreaName: '' // 求购地区
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bindMobile: app.globalData.userInfo && app.globalData.userInfo.phone
    })
    if (app.globalData.updateBuyInfo) { // 编辑
      const data = JSON.parse(app.globalData.updateBuyInfo)
      console.log(data)
      const { locationDetail, categoryFirstName, categorySecondName } = data
      let showCategoryName
      if (categorySecondName) {
        showCategoryName = `${categoryFirstName}·${categorySecondName}`
      } else {
        showCategoryName = categoryFirstName
      }
      let showAreaName
      if (!locationDetail.cityCode || locationDetail.cityName === locationDetail.provinceName) {
        showAreaName = locationDetail.provinceName
      } else {
        showAreaName = `${locationDetail.provinceName}·${locationDetail.cityName}`
      }
      this.setData({
        'params.id': data.id,
        'params.creator': data.creator,
        'params.provinceCode': locationDetail.provinceCode,
        'params.provinceName': locationDetail.provinceName,
        'params.cityCode': locationDetail.cityCode,
        'params.cityName': locationDetail.cityName,
        'params.contactPhone': data.contactMobile,
        'params.firstCategoryId': data.categoryFirstId,
        'params.secondCategoryId': data.categorySecondId,
        'params.expectedPrice': data.expectedPrice,
        'params.usageHours': data.usageHours,
        'params.yearLimitNum': data.yearLimitNum,
        'params.hasInvoice': data.hasInvoice,
        'params.hasCertificate': data.hasCertificate,
        'params.contact': data.contact,
        'params.remark': data.remark,
        showCategoryName: showCategoryName,
        showAreaName: showAreaName,
        shareCategoryName: categorySecondName || categoryFirstName
      })
    } else { // 新增
      this.setData({
        bindMobile: app.globalData.userInfo && app.globalData.userInfo.phone,
        'params.contactPhone': app.globalData.userInfo && app.globalData.userInfo.phone,
        'params.creator': app.globalData.userInfo && app.globalData.userInfo.id
      })
      wx.getStorage({
        key: 'contact',
        success: res => {
          this.setData({
            'params.contact': res.data
          })
        },
      })
      this.getLocation()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.updateBuyInfo = null
  },

  // 授权手机号前登录
  handleLogin() {
    wx.login({
      success: res => {
        this.setData({
          code: res.code
        })
      }
    })
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
      const params = {
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      fetchWxPhone(params).then(res2 => {
        const phone = res2.data.phoneNumber
        this.handleBindPhone(phone)
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
      id,
      provinceCode,
      contact,
      contactPhone,
      firstCategoryId
    } = this.data.params
    if (!firstCategoryId) return wx.showToast({
      title: '请选择设备类型',
      icon: 'none'
    })
    if (!provinceCode) return wx.showToast({
      title: '请选择求购地区',
      icon: 'none'
    })
    if (!contact) return wx.showToast({
      title: '请填写联系人',
      icon: 'none'
    })
    if (!contactPhone) return wx.showToast({
      title: '请填写联系方式',
      icon: 'none'
    })
    wx.showModal({
      title: '温馨提示',
      content: '请确保信息真实性，否则平台将进行删除并冻结您的账号！',
      confirmText: '确定发布',
      cancelColor: '#999',
      success: res => {
        if (res.confirm) {
          const apiType = id ? handleUpdateBuy : handleCreateBuy
          apiType(this.data.params).then(res => {
            const {
              id
            } = res.data
            const {
              showAreaName,
              shareCategoryName
            } = this.data
            app.globalData.refreshBuy = true
            app.globalData.refreshMyBuy = true
            const shareParams = JSON.stringify({
              id: id,
              title: `#求购# ${shareCategoryName}`
            })
            wx.redirectTo({
              url: `/pages/publish/success-buy/success-buy?params=${shareParams}`,
            })
          })
        }
      }
    })
  },

  // 获取定位城市
  getLocation() {
    // 实例化API核心类
    const qqmapsdk = new QQMapWX({
      key: '5FDBZ-CESCD-5XA4F-HQLMD-WJLA7-LDB6W'
    })
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
          'params.cityCode': city_code.substring(3, 9),
          'params.cityName': city,
          showAreaName: showArea
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {}
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
      showCategoryName: `${firstName}${trueSecondName}`,
      shareCategoryName: secondid ? secondName : firstName
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

  handleRemarkChange(e) {
    this.setData({
      'params.remark': e.detail.value
    })
  },

  handleContactChange(e) {
    this.setData({
      'params.contact': e.detail.value
    })
    wx.setStorage({
      key: 'contact',
      data: e.detail.value,
    })
  },

  handleInvoiceToggle() {
    this.setData({
      'params.hasInvoice': this.data.params.hasInvoice === 1 ? 0 : 1
    })
  },
  handleCertificateToggle() {
    this.setData({
      'params.hasCertificate': this.data.params.hasCertificate === 1 ? 0 : 1
    })
  },
  //期望价格
  bindPricePickerChange(e) {
    const leftValue = this.data.priceArray[0][e.detail.value[0]]
    const rightValue = this.data.priceArray[1][e.detail.value[1]]
    this.setData({
      pricePickerIndex: e.detail.value,
      'params.expectedPrice': rightValue ? `${leftValue}-${rightValue}万` : '面议'
    })
  },
  bindPricePickerColumnChange(e) {
    if (e.detail.column === 0) {
      const leftValue = this.data.priceArray[0][e.detail.value]
      const rightPrices = []
      if (e.detail.value !== 0) {
        for (let i = leftValue + 5; i <= 90; i += 5) {
          rightPrices.push(i)
        }
      }
      this.data.priceArray[1] = rightPrices
      this.setData({
        priceArray: this.data.priceArray
      })
    }
  },

  // 使用小时数
  bindHourPickerChange(e) {
    const index = e.detail.value
    this.setData({
      hourPickerIndex: e.detail.value,
      'params.usageHours': this.data.hourArray[index]
    })
  },

  //年限
  bindYearPickerChange(e) {
    const leftValue = this.data.yearArray[0][e.detail.value[0]]
    const rightValue = this.data.yearArray[1][e.detail.value[1]]
    this.setData({
      yearPickerIndex: e.detail.value,
      'params.yearLimitNum': `${leftValue}-${rightValue}年`
    })
  },
  bindYearPickerColumnChange(e) {
    if (e.detail.column === 0) {
      const leftValue = this.data.yearArray[0][e.detail.value]
      const rightYears = []
      for (let i = leftValue + 1; i <= 2019; i++) {
        rightYears.unshift(i)
      }
      this.data.yearArray[1] = rightYears
      this.setData({
        yearArray: this.data.yearArray
      })
    }
  },
})
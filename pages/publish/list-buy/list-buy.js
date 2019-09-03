const app = getApp()
import {
  fetchBuyList
} from '../../../api/buy.js'
import {
  handleBindPhone,
  fetchWxPhone
} from '../../../api/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authVisible: false,
    bindPhone: '', // 是否绑定手机号
    listData: [],
    params: {
      pageNum: 1,
      pageSize: 10,
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      categoryFirstId: '',
      categorySecondId: ''
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
    marginTop: ''
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
    this.checkAuthStatus()
    if (app.globalData.refreshBuy) {
      this.getList(1)
      app.globalData.refreshBuy = false
    }
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

  // 是否授权
  checkAuthStatus() {
    this.setData({
      authVisible: !app.globalData.userInfo,
      bindPhone: app.globalData.userInfo && app.globalData.userInfo.phone
    })
  },

  authHide() {
    this.setData({
      authVisible: false
    })
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
        if (item.locationDetail.provinceName === item.locationDetail.cityName) {
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


  // 授权用户手机号
  handleGetPhone(e) {
    const contactPhone = e.target.dataset.phone
    if (!e.detail.encryptedData) { // 拒绝授权
      wx.showModal({
        title: '温馨提示',
        content: '为了避免恶意骚扰，首次在平台进行电话咨询，需要绑定手机号码，平台将对你的隐私进行保护！',
        showCancel: false
      })
    } else { // 同意
      // 登录获取code
      wx.login({
        success: res => {
          const params = {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
          fetchWxPhone(params).then(res2 => {
            const bindPhone = 13328202442
            this.handleBindPhone(bindPhone, contactPhone)
          })
        }
      })
    }
  },

  // 绑定手机号
  handleBindPhone(bindPhone, contactPhone) {
    const userId = app.globalData.userInfo && app.globalData.userInfo.id
    const params = `?userId=${userId}&phone=${bindPhone}`
    handleBindPhone(params).then(() => {
      this.setData({
        bindPhone: bindPhone
      })
      app.globalData.userInfo.phone = bindPhone
      wx.setStorage({
        key: "userInfo",
        data: JSON.stringify(app.globalData.userInfo)
      })
      wx.showModal({
        title: '温馨提示',
        content: '信息由用户自行发布，平台无法杜绝可能存在的风险和瑕疵；电话洽谈时，请仔细核实，谨防诈骗！',
        confirmText: '呼叫',
        success: res => {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: contactPhone
            })
          }
        }
      })
    })
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

  handleToUserHome(e) {
    const id = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${id}`,
    })
  }
})
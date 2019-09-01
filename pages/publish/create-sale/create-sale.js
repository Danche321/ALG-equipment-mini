import {
  handleCreatePublish,
  handleUpdatePublish
} from '../../../api/publish.js'
const app = getApp()
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: null,
    isBindMobile: app.globalData.userInfo&&app.globalData.userInfo.phone, // 是否绑定手机号
    params: {
      id: '', // 编辑的时候用
      title: '',
      contactPhone: '13328202442',
      firstCategoryId: '',
      imageVideos: [], //类型：IMAGE-图片、VIDEO-视频
      outPrice: '',
      productiveYear: '', // 生产年份
      secondCategoryId: '',
      textIntroduce: '',
      voiceIntroduce: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      voiceIntroduceTime: '' //录音时长
    },
    hasVideo: false,
    selectCategoryVisible: false, // 选择机型组件
    showCategoryName: '', // 分类名称'
    showAreaName: '', // 城市名称
    selectCityVisible: false, // 选择城市组件
    selectYearVisible: false // 选择年份组件
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 编辑
    if (app.globalData.updatePublishInfo) {
      const data = JSON.parse(app.globalData.updatePublishInfo)
      console.log(data)
      const {
        id,
        title,
        contactPhone,
        categoryFirstId,
        imageVideos,
        outPrice,
        productiveYear,
        categorySecondId,
        textIntroduce,
        voiceIntroduce,
        locationDetail,
        categoryFirstName,
        categorySecondName
      } = data
      this.setData({
        'params.id': id,
        'params.title': title,
        'params.contactPhone': contactPhone,
        'params.firstCategoryId': categoryFirstId,
        'params.imageVideos': imageVideos.map(item => {
          return {
            fileUrl: item.file,
            type: item.type
          }
        }),
        'params.outPrice': outPrice,
        'params.productiveYear': `${productiveYear}年`,
        'params.secondCategoryId': categorySecondId,
        'params.textIntroduce': textIntroduce,
        'params.voiceIntroduce': voiceIntroduce,
        'params.provinceCode': locationDetail.provinceCode,
        'params.provinceName': locationDetail.provinceName,
        'params.cityCode': locationDetail.cityCode,
        'params.cityName': locationDetail.cityName,
        showCategoryName: `${categoryFirstName}·${categorySecondName}`,
        showAreaName: `${locationDetail.provinceName}·${locationDetail.cityName}`,
        hasVideo: imageVideos.some(item => item.type === 'VIDEO')
      })
    } else {
      // 新增
      this.getLocation()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    app.globalData.updatePublishInfo = null
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  handleInput(e) {
    const value = e.detail.value
    const type = e.currentTarget.dataset.type
    this.data.params[type] = value
    this.setData({
      params: this.data.params
    })
  },

  // 选择图片/视频
  handleFileAdd(e) {
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success: res => {
        if (res.tapIndex === 0) {
          this.handleChooseImg()
        } else if (res.tapIndex === 1) { //视频
          this.handleChooseVideo()
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },

  // 上传选择图片
  handleChooseImg() {
    const {
      imageVideos
    } = this.data.params
    wx.chooseImage({
      count: 9 - imageVideos.length, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        res.tempFilePaths.forEach(item => {
          this.handleUploadFile(item, 'IMAGE')
        })
      }
    })
  },

  // 上传选择视频
  handleChooseVideo() {
    wx.chooseVideo({
      sourceType: ['album'],
      success: res => {
        if (res.size > (10 * 1024 * 1024)) {
          return app.showErrMsg('视频大小不能超过10M');
        }
        this.handleUploadFile(res.tempFilePath, 'VIDEO')
      }
    })
  },

  // 上传图片/视频
  handleUploadFile(filePath, type) {
    wx.showLoading({
      title: '上传中'
    })
    wx.uploadFile({
      url: `${app.globalData.BASE_URL}/global/upload`, //开发者服务器
      filePath: filePath,
      name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
      success: res => {
        const {
          domainUrl
        } = JSON.parse(res.data).data
        this.data.params.imageVideos.push({
          fileUrl: domainUrl,
          type: type //类型：IMAGE-图片、VIDEO-视频
        })
        this.setData({
          'params.imageVideos': this.data.params.imageVideos
        })
        if (type === 'VIDEO') {
          this.setData({
            hasVideo: true
          })
        }
        wx.hideLoading();
      },
      fail: res => {
        wx.hideLoading();
      }
    })
  },

  // 移除照片/视频
  handleRemove(e) {
    const {
      index,
      type
    } = e.currentTarget.dataset
    this.data.params.imageVideos.splice(index, 1)
    let hasVideo
    if (type === 'VIDEO') hasVideo = false
    this.setData({
      'params.imageVideos': this.data.params.imageVideos,
      hasVideo: hasVideo
    })
  },

  // 授权用户手机号
  handleGetPhone(e) {
    console.log(e)
    if (!e.detail.encryptedData) {
      wx.showModal({
        title: '温馨提示',
        content: '为了保证信息的真实性，首次在平台进行信息发布，需要绑定手机号码，平台将对你的隐私进行保护！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
      })
    } else {
      this.handleSubmit()
    }
  },

  // 发布
  handleSubmit() {
    const {
      id,
      title,
      provinceCode,
      contactPhone,
      firstCategoryId,
      imageVideos
    } = this.data.params
    if (!title) return wx.showToast({
      title: '请填写标题',
      icon: 'none'
    })
    if (!imageVideos.length) return wx.showToast({
      title: '请上传设备图片/视频',
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
      title: '确定发布？',
      content: '请确保设备信息真实性，否则平台将进行删除并冻结您的账号！',
      confirmText: '确定发布',
      cancelColor: '#999',
      success: res => {
        if (res.confirm) {
          if (this.data.params.productiveYear) {
            this.data.params.productiveYear = this.data.params.productiveYear.substring(0, this.data.params.productiveYear.length - 1)
          }
          if (!id) { // 新增
            if (this.data.tempFilePath) {
              this.uploadFileVoice().then(() => {
                this.handleCreate()
              })
            } else {
              this.handleCreate()
            }
          } else { // 编辑
            this.handleUpdate()
          }
        } else if (res.cancel) {}
      }
    })
  },

  // 创建发布
  handleCreate() {
    handleCreatePublish(this.data.params).then(res => {
      const {
        id
      } = res.data
      const {
        title,
        imageVideos
      } = this.data.params
      const shareParams = JSON.stringify({
        id: id,
        title: title,
        imgUrl: imageVideos[0].fileUrl
      })
      wx.redirectTo({
        url: `/pages/publish/publish-success/publish-success?params=${shareParams}`,
      })
    })
  },

  // 修改发布
  handleUpdate() {
    handleUpdatePublish(this.data.params).then(res => {
      const {
        id,
        title,
        imageVideos
      } = this.data.params
      const shareParams = JSON.stringify({
        id: id,
        title: title,
        imgUrl: imageVideos[0].fileUrl
      })
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.getList(1)
      wx.redirectTo({
        url: `/pages/publish/publish-success/publish-success?params=${shareParams}`,
      })
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

  // 选择年份显示
  handleShowYear() {
    this.setData({
      selectYearVisible: true
    })
  },

  // 选择年份确定
  handleYearConfirm(e) {
    this.setData({
      selectYearVisible: false
    })
    const year = e.detail
    if (year) {
      this.setData({
        'params.productiveYear': year
      })
    }
  },

  //录音确认
  handleRecordConfirm(e) {
    this.setData({
      tempFilePath: JSON.parse(e.detail).file,
      'params.voiceIntroduceTime': JSON.parse(e.detail).second,
    })
  },

  // 上传录音文件
  uploadFileVoice() {
    wx.showLoading({
      title: '上传中'
    })
    return new Promise(resolve => {
      wx.uploadFile({
        url: `${app.globalData.BASE_URL}/global/upload`, //开发者服务器
        filePath: this.data.tempFilePath,
        name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        formData: {
          'type': 1
        },
        header: {
          'Content-Type': 'multipart/form-data'
        },
        success: res => {
          const {
            url
          } = JSON.parse(res.data).data
          this.setData({
            'params.voiceIntroduce': url
          })
          wx.hideLoading();
          resolve(res)
        },
        fail: function(res) {
          wx.hideLoading();
          resolve(res)
        }
      })
    })
  }
})
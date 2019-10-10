import {
  handleCreatePublish,
  handleUpdatePublish
} from '../../../api/publish.js'
import { handleBindPhone, fetchWxPhone } from '../../../api/common.js'
import { checkPhone } from '../../../utils/rules.js'
const app = getApp()
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
const yearArr = []
for (let i = 1989; i <= 2019; i++) {
  yearArr.push(`${i}年`)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    audioFilePath: null, // 录音文件
    code: '', // 授权手机号前的登录code
    bindMobile: '', // 是否绑定手机号
    params: {
      id: '', // 编辑的时候用
      title: '',
      contactPhone: '',
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
      voiceIntroduceTime: 0, //录音时长
      usageHours: '', // 使用小时数
      hasInvoice: 0, // 发票
      hasCertificate: 0, // 合格证
    },
    hasVideo: false,
    showAreaName: '', // 城市名称
    selectCityVisible: false, // 选择城市组件
    video: {
      visible: false,
      src: '',
      showImg: ''
    },
    yearArray: yearArr
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bindMobile: app.globalData.userInfo && app.globalData.userInfo.phone
    })
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
      let showAreaName
      if (!locationDetail.cityCode || locationDetail.cityName === locationDetail.provinceName) {
        showAreaName = locationDetail.provinceName
      } else {
        showAreaName = `${locationDetail.provinceName}·${locationDetail.cityName}`
      }
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
        'params.outPrice': outPrice === '0' ? '' : outPrice,
        'params.productiveYear': productiveYear?`${productiveYear}`:'',
        'params.secondCategoryId': categorySecondId,
        'params.textIntroduce': textIntroduce,
        'params.voiceIntroduce': voiceIntroduce,
        'params.provinceCode': locationDetail.provinceCode,
        'params.provinceName': locationDetail.provinceName,
        'params.cityCode': locationDetail.cityCode,
        'params.cityName': locationDetail.cityName,
        showAreaName: showAreaName,
        hasVideo: imageVideos.some(item => item.type === 'VIDEO')
      })
    } else {
      wx.getStorage({
        key: 'createSaleType',
        success: res => {
          const params = JSON.parse(res.data)
          this.setData({
            'params.firstCategoryId': params.firstid,
            'params.secondCategoryId': params.secondid
          })
        }
      })
      wx.getStorage({
        key: 'saleContact',
        success: res => {
          this.setData({
            'params.contact': res.data
          })
        },
      })
      // 新增
      this.setData({
        'params.contactPhone': app.globalData.userInfo && app.globalData.userInfo.phone
      })
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

  // 选择图片/
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
      count: 20 - imageVideos.length, // 默认20
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
        const { tempFilePath } = res
        this.handleUploadFile(tempFilePath, 'VIDEO')
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
        if (type === 'VIDEO') {
          this.data.params.imageVideos.unshift({
            fileUrl: domainUrl,
            type: type //类型：IMAGE-图片、VIDEO-视频
          })
          this.setData({
            'video.showImg': `${domainUrl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast`
          })
        } else {
          this.data.params.imageVideos.push({
            fileUrl: domainUrl,
            type: type //类型：IMAGE-图片、VIDEO-视频
          })
        }
        this.setData({
          'params.imageVideos': this.data.params.imageVideos
        })
        if (type === 'VIDEO') {
          this.setData({
            hasVideo: true,
            'video.src': domainUrl
          })
        }
        wx.hideLoading();
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
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
        content: '为了保证信息的真实性，首次在平台进行信息发布，需要绑定手机号码，平台将对你的隐私进行保护！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
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
      title: '请选择发货城市',
      icon: 'none'
    })
    if (!contactPhone) return wx.showToast({
      title: '请填写联系方式',
      icon: 'none'
    })
    wx.showModal({
      title: '温馨提示',
      content: '请确保设备信息真实性，否则平台将进行删除并冻结您的账号！',
      confirmText: '确定发布',
      cancelColor: '#999',
      success: res => {
        if (res.confirm) {
          if (this.data.params.productiveYear) {
            this.data.params.productiveYear = this.data.params.productiveYear.substring(0, this.data.params.productiveYear.length - 1)
          }
          if (!id) { // 新增
            if (this.data.audioFilePath) {
              this.uploadFileVoice().then(() => {
                this.handleCreate()
              })
            } else {
              this.handleCreate()
            }
          } else { // 编辑
            this.handleUpdate()
          }
        }
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
        imgUrl: imageVideos[0].fileUrl,
        imgList: imageVideos.map(item => item.fileUrl),
        showAreaName: this.data.showAreaName
      })
      console.log(shareParams)
      wx.redirectTo({
        url: `/pages/publish/publish-success/publish-success?params=${shareParams}`,
      })
      app.globalData.refreshHome = true
      app.globalData.refreshSearch = true
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
        imgUrl: imageVideos[0].fileUrl,
        imgList: imageVideos.map(item => item.fileUrl),
        showAreaName: this.data.showAreaName
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

  // 出厂日期确定
  bindYearPickerChange(e) {
    const year = this.data.yearArray[e.detail.value]
    this.setData({
      'params.productiveYear': year
    })
  },
  
  // 发票
  handleInvoiceToggle() {
    this.setData({
      'params.hasInvoice': this.data.params.hasInvoice === 1 ? 0 : 1
    })
  },

  // 合格证
  handleCertificateToggle() {
    this.setData({
      'params.hasCertificate': this.data.params.hasCertificate === 1 ? 0 : 1
    })
  },

  // 联系人
  handleContactChange(e) {
    this.setData({
      'params.contact': e.detail.value
    })
    wx.setStorage({
      key: 'saleContact',
      data: e.detail.value,
    })
  },

  //录音确认
  handleRecordConfirm(e) {
    this.data.audioFilePath = JSON.parse(e.detail).file
    this.setData({
      'params.voiceIntroduce': JSON.parse(e.detail).file,
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
        filePath: this.data.audioFilePath,
        name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        formData: {
          'type': 1
        },
        header: {
          'Content-Type': 'multipart/form-data'
        },
        success: res => {
          const {
            domainUrl
          } = JSON.parse(res.data).data
          this.setData({
            'params.voiceIntroduce': domainUrl
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
  },

  // 图片预览
  handlePriviewImg(event) {
    const src = event.currentTarget.dataset.src; //获取data-src
    const imgList = this.data.params.imageVideos.filter(item => item.type ==='IMAGE').map(item => item.fileUrl) //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  
  // 视频预览
  handlePriviewVideo() {
    const videoContext = wx.createVideoContext('myVideo', this);
    videoContext.requestFullScreen({ direction: 0 });
    this.setData({
      'video.visible': true
    })
  },
  // 视频进入退出全屏
  bindfullscreenchange(e) {
    this.setData({
      'video.visible': e.detail.fullScreen
    })
  }
})
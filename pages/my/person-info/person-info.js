import {
  fetchUserInfo,
  handleUpdateInfo
} from '../../../api/my.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    region: [],
    headImgShow: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // 获取个人信息
  getUserInfo() {
    fetchUserInfo().then(res => {
      const { provinceCode, provinceName, cityCode, cityName, areaCode, areaName } = res.data
      this.setData({
        userInfo: res.data,
        region: [provinceCode, cityCode, areaCode],
        headImgShow: res.data.headPortrait
      })
    })
  },

  // 去修改资料
  handleToUpdate(e) {
    const {
      type,
      value
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/my/update-info/update-info?key=${type}&value=${value}`,
    })
  },

  // 修改个人资料确定
  handleUpdateSubmit(type) {
    console.log(type)
    const {
      headPortrait,
      nickName,
      provinceCode,
      cityCode,
      areaCode,
      signature,
      provinceName,
      cityName,
      areaName
    } = this.data.userInfo
    const userId = app.globalData.userInfo.id
    let params = `userId=${userId}&`
    switch (type) {
      case 'headPortrait' :
        params += `headPortrait=${headPortrait}`
        break
      case 'area':
        params += `provinceCode=${provinceCode}&cityCode=${cityCode}&areaCode=${areaCode}&provinceName=${provinceName}&cityName=${cityName}&areaName=${areaName}`
        break
      case 'signature':
        params += `signature=${signature}`
        break
      case 'nickName':
      console.log(111)
        console.log(nickName)
        params += `nickName=${nickName}`
        break
    }
    handleUpdateInfo(params).then(() => {
      wx.showToast({
        title: '修改成功',
      })
    })
  },

  // 区域选择

  bindRegionChange(e) {
    const data = e.detail
    this.setData({
      'userInfo.provinceCode': data.code[0],
      'userInfo.cityCode': data.code[1],
      'userInfo.areaCode': data.code[2],
      'userInfo.provinceName': data.value[0],
      'userInfo.cityName': data.value[1],
      'userInfo.areaName': data.value[2],
      'userInfo.location': `${data.value[0]}·${data.value[1]}·${data.value[2]}`
    })
    this.handleUpdateSubmit('area')
  },

  // 上传头像
  handleUpload() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        const srcArr = res.tempFilePaths
        const size = res.tempFiles[0].size / (1024 * 1024);
        if (size > 4) {
          app.showErrMsg('存在超过4M的图片上传失败');
          return;
        }
        this.uploadImg(srcArr[0])
      }
    })
  },

  uploadImg(filePath) {
    var self = this;
    wx.showLoading({
      title: '上传中'
    })
    wx.uploadFile({
      url: `${app.globalData.BASE_URL}/global/upload`, //开发者服务器
      filePath: filePath,
      name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
      success: res => {
        const { url, domainUrl } = JSON.parse(res.data).data
        this.setData({
          'userInfo.headPortrait': url,
          headImgShow: domainUrl
        })
        this.handleUpdateSubmit('headPortrait')
        wx.hideLoading();
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },
})
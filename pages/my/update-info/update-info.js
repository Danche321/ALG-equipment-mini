const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    key: '',
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { key, value } = options
    wx.setNavigationBarTitle({
      title: key === 'nickName' ? '更改昵称' : '个性签名',
    })
    this.setData({
      key,
      value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 绑定输入框值
  handleInputChange(e) {
    this.setData({
      value: e.detail.value
    })
  },

  // 保存
  handleSave() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (this.data.key==='nickName') {
      prevPage.setData({
        'userInfo.nickName': this.data.value
      })
      prevPage.handleUpdateSubmit('nickName')
    } else if (this.data.key === 'signature') {
      prevPage.setData({
        'userInfo.signature': this.data.value
      })
      prevPage.handleUpdateSubmit('signature')
    }
    wx.navigateBack({
      delta: 1,
    })
  }
})
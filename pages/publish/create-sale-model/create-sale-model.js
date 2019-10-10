const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    first: '',
    second: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      listData: app.globalData.categoryList
    })
  },
  handleSelect(e) {
    const {
      first,
      second,
    } = e.currentTarget.dataset
    this.setData({
      first: first,
      second: second
    })
  },
  handleNext() {
    const { first, second } = this.data
    const params = {
      firstid: first.id,
      firstName: first.name,
      secondid: second.id,
      secondName: second.name
    }
    wx.setStorage({
      key: 'createSaleType',
      data: JSON.stringify(params),
      success: () => {
        wx.navigateTo({
          url: '/pages/publish/create-sale/create-sale',
        })
      }
    })
  }
})
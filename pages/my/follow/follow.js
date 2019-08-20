import { fetchMyFollow } from '../../../api/my.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    params: {
      pageNum: 1,
      pageSize: 10
    },
    hasNextPage: true
  },

  getList(isFirst) {
    const params = this.data.params
    if (isFirst) this.data.params.pageNum = 1
    fetchMyFollow(params).then(res => {
      const {
        items,
        hasNextPage
      } = res.data
      this.setData({
        listData: items,
        hasNextPage
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
    this.getList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.data.params.pageNum++
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
const app = getApp()
import { fetchMyDynamic } from '../../../api/my.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
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
    fetchMyDynamic(params).then(res => {
      const { items, hasNextPage } = res.data
      let resList = []
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

  // 跳转发布详情
  handleToDetail(e) {
    const id = e.currentTarget.dataset.publishid
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
    })
  },

  handleToUserHome(e) {
    console.log(e)
    const { userid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/my/person-home/person-home?id=${userid}`,
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
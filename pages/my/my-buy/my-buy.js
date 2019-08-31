const app = getApp()
import {
  fetchMyBuyList,
  handleDownBuy
} from '../../../api/buy.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    params: {
      pageNum: 1,
      pageSize: 10,
      shelfStatus: 1
    },
    hasNextPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(1)
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

  // 发布列表
  getList(isFirst) {
    const params = this.data.params
    if (isFirst) this.data.params.pageNum = 1
    fetchMyBuyList(params).then(res => {
      const {
        items,
        hasNextPage
      } = res.data
      let resList = []
      items.map(item => {
        item.locationText = `${item.locationDetail.provinceName}·${item.locationDetail.cityName}`
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
  
  // tab切换
  handleTabChange(e) {
    this.setData({
      'params.shelfStatus': e.currentTarget.dataset.type
    })
    this.getList(1)
  },

  //下架
  handleDown(e) {
    const id = e.target.dataset.id
    const index = e.target.dataset.index
    wx.showModal({
      title: '下架该信息？',
      content: '下架后平台将不再进行展示',
      success: res => {
        if (res.confirm) {
          const params = {
            purchaseInformationId: id
          }
          handleDownBuy(params).then(() => {
            this.data.listData.splice(index, 1)
            this.setData({
              listData: [...this.data.listData]
            })
            wx.showToast({
              title: '已下架',
            })
          })
        } else if (res.cancel) {
        }
      }
    })
  },
})
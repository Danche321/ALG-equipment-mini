import { fetchMyPublish, handleDown, handleRePublish } from '../../../api/my.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    totalCount: 0,
    params: {
      pageNum: 1,
      pageSize: 10,
      isDownShelf: 1
    },
    hasNextPage: true
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

  },

  getList(isFirst) {
    const params = this.data.params
    if (isFirst) this.data.params.pageNum = 1
    fetchMyPublish(params).then(res => {
      const { items, hasNextPage, totalCount } = res.data
      let resList = []
      if (isFirst) {
        resList = items
      } else {
        resList = [...this.data.listData, ...items]
      }
      this.setData({
        listData: resList,
        hasNextPage,
        totalCount
      })
      if (isFirst) wx.stopPullDownRefresh()
    })
  },

  //下架
  handleDown(e) {
    const id = e.target.dataset.id
    const index = e.target.dataset.index
    wx.showModal({
      title: '下架信息？',
      content: '下架后平台将不再进行展示',
      success: res => {
        if (res.confirm) {
          const params = {
            publishId: id
          }
          handleDown(params).then(() => {
            this.data.listData[index].isDownShelf = true
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

  // 重新发布
  handleRePublish(e) {
    const { index, id } = e.currentTarget.dataset
    wx.showModal({
      title: '重新发布？',
      content: '请确保设备信息真实性，否则平台将进行删除并冻结您的账号！',
      cancelText: '确定发布',
      confirmText: '重新编辑',
      cancelColor: '#999',
      success: res => {
        if (res.confirm) {
          const itemInfo = this.data.listData[index]
          app.globalData.updatePublishInfo = JSON.stringify(itemInfo)
          wx.navigateTo({
            url: '/pages/publish/create-sale/create-sale',
          })
        } else if (res.cancel) {
          const params = {
            publishId: id
          }
          handleRePublish(params).then(() => {
            this.data.listData[index].isDownShelf = false
            this.setData({
              listData: [...this.data.listData]
            })
            wx.showToast({
              title: '发布成功',
            })
          })
        }
      }
    })
  },

  // 编辑
  handleUpdate(e) {
    const { index, id } = e.currentTarget.dataset
    const itemInfo = this.data.listData[index]
    app.globalData.updatePublishInfo = JSON.stringify(itemInfo)
    wx.navigateTo({
      url: '/pages/publish/create-sale/create-sale',
    })
  },

  // 详情
  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
    })
  },

  // tab切换
  handleTabChange(e) {
    this.setData({
      'params.isDownShelf': e.currentTarget.dataset.type
    })
    this.getList(1)
  }
})
import { fetchMyPublish, handleDown, handleRePublish } from '../../../api/my.js'

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
    fetchMyPublish(params).then(res => {
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
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.showModal({
      title: '重新发布？',
      content: '请确保设备信息真实性，否则平台将进行删除并对您的行为作出限制！',
      cancelText: '确定发布',
      confirmText: '去编辑',
      cancelColor: '#999',
      success: res => {
        if (res.confirm) {
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

  // 详情
  handleToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/publish/detail/detail?id=${id}`,
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
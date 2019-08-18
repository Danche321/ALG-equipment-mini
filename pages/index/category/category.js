// pages/index/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categaryList: [{
      name: '挖掘机',
      id: 1,
      children: [{
        name: '哈哈1',
        icon: ''
      }, {
        name: '哈哈2',
        icon: ''
      }, {
        name: '哈哈3',
        icon: ''
      }]
    },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机', id: 1 },
     { name: '挖掘机22', id: 1 }
    ],
    activeIndex: 0
  },

  // 切换分类
  handleTypeChange(e) {
    const { index } = e.target.dataset
    this.setData({
      activeIndex: index
    })
    if (!this.data.categaryList[index].children) {
      this.getChildren(index)
    }
  },
  //获取子类别
  getChildren(index) {
    this.data.categaryList[index].children = [{
      name: '履带装载机1',
      icon: ''
    }, {
      name: '履带装载机2',
      icon: ''
    }, {
      name: '履带装载机3',
      icon: ''
    }]
    this.setData({
      categaryList: [...this.data.categaryList]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
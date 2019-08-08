const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    interval: 4000,
    duration: 100,
    statusBarHeight: '',
    titleBar: {
      height: '',
      top: '',
      width: '',
      left: ''
    },
    categoryList: [{
      url: '',
      name: '挖掘机11'
    }, {
      url: '',
      name: '挖掘机2'
    }, {
      url: '',
      name: '挖掘机3'
    }, {
      url: '',
      name: '挖掘机4'
    }, {
      url: '',
      name: '挖掘机5'
    }, {
      url: '',
      name: '挖掘机6'
    }, {
      url: '',
      name: '挖掘机7'
    }, {
      url: '',
      name: '挖掘机8'
    }, {
      url: '',
      name: '挖掘机9'
    }],
    publishList: [
      {
        img: '',
        title: '八成二手挖机转让八成二手挖机转让八成二手挖机转让八成二手挖机转让八成二手挖机转让',
        voice: {
          width: '30%',
          second: 15
        },
        price: '8999',
        area: '福建·平潭',
        headImg: '',
        nickname: '高哥哥二手机械高哥哥二手机械'
      }, {
        img: '',
        title: '八成二手挖机转让',
        voice: {
          width: '50%',
          second: 30
        },
        price: '8999',
        area: '福建·平潭',
        headImg: '',
        nickname: '高哥哥二手机械'
      }, {
        img: '',
        title: '八成二手挖机转让',
        voice: {
          width: '100%',
          second: 60
        },
        price: '8999',
        area: '福建·平潭',
        headImg: '',
        nickname: '高哥哥二手机械'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        const sys = wx.getSystemInfoSync()
        const menu = wx.getMenuButtonBoundingClientRect()
        const statusHeight = sys.statusBarHeight
        const titleHeight = menu.height
        const titleRowWidth = sys.right - menu.right
        const titleColumnHeight = menu.top - sys.statusBarHeight
        this.setData({
          statusBarHeight: statusHeight,
          'titleBar.height': titleHeight,
          'titleBar.top': titleColumnHeight,
          'titleBar.left': sys.screenWidth - menu.right,
          'titleBar.width': sys.screenWidth - (sys.screenWidth - menu.right) * 3 - menu.width
        })
      },
      fail: () => {}
    })
  },

  getData() {
    this.setData({
      publishList: [...this.data.publishList, ...this.data.publishList]
    })
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
    this.getData()
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
    if (this.data.isBottom) return
    this.setData({
      page: ++this.data.page,
      size: 10,
    });
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
//app.js
App({
  onLaunch: function() {
    this.overShare()
  },

  //重写分享方法
  overShare: function() {
    //监听路由切换
    //间接实现全局设置分享内容
    wx.onAppRoute(function(res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1],
        data;
      if (view) {
        data = view.data;
        if (!data.isOverShare) {
          data.isOverShare = true;
          view.onShareAppMessage = function() {
            //你的分享配置
            return {
              title: '麒麟二手工程机械',
              path: '/pages/index/home/home'
            };
          }
        }
      }
    })
  },


  globalData: {
    BASE_URL: 'https://test.lanchengyun.com', // 测试环境
    FILE_URL: 'https://mechanical-test.oss-cn-hangzhou.aliyuncs.com/', // 测试环境
    // BASE_URL: 'https://www.lanchengyun.com', // 生产环境
    userInfo: wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')) : null, // 用户信息
    searchText: '', // 搜索关键字
    searchCategoryFirstId: '', // 搜索一级类别id
    searchCategoryFirstName: '', // 搜索一级类别名称
    searchCategorySecondId: '', // 搜索二级类别id
    searchCategorySecondName: '', // 搜索二级类别名称
    updatePublishInfo: null, // 编辑的发布信息
    refreshHome: false, // 是否刷新首页的数据
    refreshSearch: false, // 是否刷新搜索页的数据
    refreshBuy: false // 是否刷新求购信息列表
  }
})
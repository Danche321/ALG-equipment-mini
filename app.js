const ICON_URL = 'https://mechanical.oss-cn-hangzhou.aliyuncs.com/project_mini_icon/'
// const BASE_URL = 'https://test.lanchengyun.com'
const BASE_URL = 'https://www.lanchengyun.com'
App({
  onLaunch: function() {
    this.checkVersion()
    this.overShare()
    this.getCategory()
    this.getBrand()
  },

  // 检查版本更新
  checkVersion: function() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
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
              title: '全国工程二手机械信息，免费发布平台',
              path: '/pages/index/home/home',
              imageUrl: `${ICON_URL}share.png`
            };
          }
        }
      }
    })
  },

  // 获取分类列表
  getCategory: function () {
    wx.request({
      url: `${BASE_URL}/category/categoryForList.action`,
      method: 'get',
      success: res => {
        this.globalData.categoryList = res.data.data
      }
    })
  },

  // 获取品牌列表
  getBrand: function () {
    wx.request({
      url: `${BASE_URL}/brand/search.action`,
      method: 'get',
      success: res => {
        const brandList = res.data.data
        const searchLetter = []
        const hotList = []
        brandList.forEach(item => {
          if (!searchLetter.includes(item.capital)) {
            searchLetter.push(item.capital)
          }
          if (!hotList.includes(item.id) && item.isHot === 1) {
            hotList.push(item)
          }
        })
        this.globalData.brandList.letters = searchLetter
        this.globalData.brandList.hotList = hotList
        // 品牌列表
        const tempObj = [];
        for (let i = 0; i < searchLetter.length; i++) {
          const capital = searchLetter[i];
          const brandInfo = [];
          const tempArr = {};
          tempArr.capital = capital;
          for (let j = 0; j < brandList.length; j++) {
            if (capital == brandList[j].capital) {
              brandInfo.push(brandList[j]);
            }
          }
          tempArr.brandInfo = brandInfo;
          tempObj.push(tempArr);
        }
        this.globalData.brandList.list = tempObj
      }
    })
  },


  globalData: {
    BASE_URL: BASE_URL,
    ICON_URL: ICON_URL,
    userInfo: wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')) : null, // 用户信息
    searchText: '', // 搜索关键字
    searchCategoryFirstId: '', // 搜索一级类别id
    searchCategoryFirstName: '', // 搜索一级类别名称
    searchCategorySecondId: '', // 搜索二级类别id
    searchCategorySecondName: '', // 搜索二级类别名称
    updatePublishInfo: null, // 编辑的发布信息
    updateBuyInfo: null, // 编辑求购信息
    refreshHome: false, // 是否刷新首页的数据
    refreshSearch: false, // 是否刷新搜索页的数据
    refreshBuy: false, // 是否刷新求购信息列表
    refreshMyBuy: false, // 是否刷新我的求购信息列表
    categoryList: [], // 分类列表
    brandList: {
      list: [], // 品牌列表
      hotList: [], // 热门品牌
      letters: [], // 首字母
    },
  }
})
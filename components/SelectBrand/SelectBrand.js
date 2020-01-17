var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: Boolean,
    brandId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    brandList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    hotList: []
  },

  
  lifetimes: {
    ready: function () {
      // 生命周期函数--监听页面加载
      const searchLetter = app.globalData.brandList.letters;
      const brandList = app.globalData.brandList.list;
      const hotList = app.globalData.brandList.hotList;
      this.setData({
        searchLetter: searchLetter,
        brandList: brandList,
        hotList: hotList
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickLetter: function (e) {
      var showLetter = e.currentTarget.dataset.letter;
      console.log(showLetter)
      this.setData({
        showLetter: showLetter,
        isShowLetter: true,
        scrollTopId: showLetter,
      })
      var that = this;
      setTimeout(function () {
        that.setData({
          isShowLetter: false
        })
      }, 1000)
    },
    //选择城市
    bindSelectCity: function (e) {
      const { id, name } = e.currentTarget.dataset
      this.triggerEvent('checked', JSON.stringify({
        id,
        name
      }))
    },
    //点击热门城市回到顶部
    hotCity: function () {
      this.setData({
        scrollTop: 0,
      })
    },
    // 关闭
    handleHidden() {
      this.triggerEvent('checked')
    },

    // 阻止页面滚动
    stopScroll() { }
  }
})

const app = getApp()

Component({
  properties: {
    visible: Boolean,
    activeYear: String
  },
  data: {
    ICON_URL: app.globalData.ICON_URL,
    listData: []
  },
  lifetimes: {
    attached: function() {
      this.getList()
    },
    detached: function() {},
  },
  methods: { // 获取所有年份
    getList() {
      for (let i = 2019; i >= 1980; i--) {
        this.data.listData.push(`${i}年`)
      }
      this.setData({
        listData: this.data.listData
      })
    },
    // 选中分类
    handleSelectCategory(e) {
      const { year } = e.currentTarget.dataset
      this.triggerEvent('checked', year)
    },
    // 关闭
    handleHidden() {
      this.triggerEvent('checked')
    }
  }
})
import {
  fetchAllCategory
} from '../../api/index.js'
const app = getApp()
Component({
  properties: {
    visible: Boolean,
    firstId: String,
    secondId: String
  },
  data: {
    ICON_URL: app.globalData.ICON_URL,
    listData: [],
    showFirstId: ''
  },
  lifetimes: {
    attached: function() {
      this.getList()
    },
    detached: function() {},
  },
  methods: { // 获取所有列表
    getList() {
      fetchAllCategory().then(res => {
        this.setData({
          listData: res.data.map(item => {
            item.children.unshift({
              name: '不限',
              id: ''
            })
            return item
          })
        })
      })
    },
    // 点击一级分类展开
    handleSelectFirst(e) {
      const {
        id
      } = e.target.dataset
      this.setData({
        showFirstId: id === this.data.showFirstId ? '' : id
      })
    },
    // 选中分类
    handleSelectCategory(e) {
      const {
        first,
        second,
      } = e.currentTarget.dataset
      const firstid = first.id
      const firstName = first.name
      const secondid = second.id
      const secondName = second.name
      const params = {
        firstid,
        firstName,
        secondid,
        secondName
      }
      this.triggerEvent('checked', JSON.stringify(params))
    },
    // 关闭
    handleHidden() {
      this.triggerEvent('checked')
    },

    // 阻止页面滚动
    stopScroll() { }
  }
})
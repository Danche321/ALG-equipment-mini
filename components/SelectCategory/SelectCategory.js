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
    listData: [],
    showFirstId: '',
    activeFirstId: '',
    activeSecondId: ''
  },
  lifetimes: {
    attached: function () {
      this.getList()
    },
    detached: function () {
    },
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
      const { id } = e.target.dataset
      this.setData({
        showFirstId: id
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
      this.setData({
        activeSecondId: secondid,
        activeFirstId: firstid
      })
      app.globalData.searchCategoryFirstId = firstid
      app.globalData.searchCategoryFirstName = firstName
      app.globalData.searchCategorySecondId = secondid
      app.globalData.searchCategorySecondName = secondName
      this.triggerEvent('checked')
    },
    // 关闭
    handleHidden() {
      this.triggerEvent('checked')
    }
  }
})
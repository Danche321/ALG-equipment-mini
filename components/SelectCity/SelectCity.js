const app = getApp()
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
let qqmapsdk
Component({
  properties: {
    visible: Boolean
  },
  data: {
    listData: [],
    showFirstId: '',
    activeFirstId: '',
    activeSecondId: ''
  },
  lifetimes: {
    attached: function() {
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        key: '5FDBZ-CESCD-5XA4F-HQLMD-WJLA7-LDB6W'
      });
      this.getList()
    },
    detached: function() {},
  },
  methods: { // 获取所有列表
    getList() {
      qqmapsdk.getCityList({
        success: res => {
          const province = res.result[0]
          this.setData({
            listData: province
          })
        },
        fail: function(res) {},
        complete: function(res) {}
      })
    },
    // 点击一级分类展开
    handleSelectFirst(e) {
      const {
        id,
        name,
        index
      } = e.target.dataset
      const excludeArea = ['北京', '天津', '上海', '重庆', '台湾', '香港', '澳门']
      if (!this.data.listData[index].children) {
        qqmapsdk.getDistrictByCityId({
          // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
          id: id, //对应接口getCityList返回数据的Id，如：北京是'110000'
          success: res => {
            let childCitys = []
            if (excludeArea.includes(name)) {
              childCitys = [{
                id: '',
                name: '不限制'
              }]
            } else {
              childCitys = [{
                id: '',
                name: '不限制'
              }, ...res.result[0]]
            }
            this.data.listData[index].children = childCitys
            this.setData({
              listData: [...this.data.listData]
            })
          },
          fail: function(error) {},
          complete: function(res) {}
        })
      }
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
      this.setData({
        activeSecondId: second.id,
        activeFirstId: first.id
      })
      this.triggerEvent('checked', JSON.stringify({ first, second}))
    },
    // 关闭
    handleHidden() {
      this.triggerEvent('checked')
    }
  }
})
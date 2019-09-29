const app = getApp()
Component({
  properties: {
    visible: Boolean
  },
  data: {
    ICON_URL: app.globalData.ICON_URL
  },
  lifetimes: {
    attached: function () {
    },
    detached: function () { },
  },
  methods: {
  }
})
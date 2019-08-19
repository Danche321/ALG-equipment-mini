const BASE_URL = 'http://116.62.19.123:7004'
const app = getApp()

export default function request({
  url,
  method,
  data,
  closeLoading
}) {
  return new Promise((resolve, reject) => {
    if (!closeLoading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    wx.request({
      url: `${BASE_URL}${url}`,
      data: Object.assign({}, data, { userId: app.globalData.userId }),
      method,
      success: res => {
        const { code, data, msg } = res.data
        if (code !== '111111') {
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          reject(msg)
        } else {
          resolve(res.data)
        }
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
        reject(err.errMsg)
        wx.hideLoading()
      }
    })
  });
}
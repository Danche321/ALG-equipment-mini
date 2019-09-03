const app = getApp()
const BASE_URL = app.globalData.BASE_URL

export default function request({
  url,
  method,
  data,
  closeLoading,
  closeToast
}) {
  return new Promise((resolve, reject) => {
    if (!closeLoading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    const userId = app.globalData.userInfo ? app.globalData.userInfo.id : ''
    let resData = data || {}
    if (resData && !resData.userId) resData.userId = userId
    wx.request({
      url: `${BASE_URL}${url}`,
      data: resData,
      method,
      success: res => {
        const { code, data, msg } = res.data
        if (code !== '111111') {
          wx.hideLoading()
          if (!closeToast && msg !=='发布不存在') {
            wx.showToast({
              title: msg || '连接失败，请检查网络状态',
              icon: 'none'
            })
          }
          reject(msg)
        } else {
          wx.hideLoading()
          resolve(res.data)
        }
      },
      fail: err => {
        wx.hideLoading()
        if (!closeToast) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
        reject(err.errMsg)
      }
    })
  });
}
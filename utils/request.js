const app = getApp()
const BASE_URL = app.globalData.BASE_URL

export default function request({
  url,
  method,
  responseType,
  data,
  closeLoading,
  closeToast,
  closeCheck
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
      // responseType: responseType || 'text',
      success: res => {
        const { code, data, msg } = res.data
        if (code !== '111111' && !closeCheck) {
          wx.hideLoading()
          const exCludeMsg = ['发布不存在', '用户已被删除']
          if (!closeToast && !exCludeMsg.includes(msg)) {
            wx.showToast({
              title: msg || '连接失败，请检查网络状态',
              icon: 'none'
            })
          }
          if (msg === '用户已被删除') {
            wx.showModal({
              title: '账号被冻结！',
              content: '您的账号由于操作不当，已被平台冻结，如需解除请联系平台客服',
              showCancel: false,
              confirmText: '我知道了'
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
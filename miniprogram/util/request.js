// 公共request方法
const requestUrl = ({
  url,
  params,
  success,
  method = "post"
}) => {
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  let baseUrl = 'http:baidu.com'
  let token = wx.getStorageSync('token')
  if (token) {
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
      token
    }

  } else {
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data: params,
      header,
      success: res => {
        wx.hideLoading()
        if(!token){
          wx.setStorageSync('token', token)
        }
        if(res.code==='000000'){
          resolve(res)
        }else{
          wx.showToast({
            title: res.msg||'请求出错',
            icon:'none',
            mask:true,
            duration:200
          })
          reject(res.msg)
        }
      },
      fail:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '网络出错',
          icon:none,
          mask:true
        })
        reject(res)
      }
    })
  })
}
module.exports = { requestUrl}
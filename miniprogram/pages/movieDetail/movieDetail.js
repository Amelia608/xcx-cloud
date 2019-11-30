// pages/movieDetail/movieDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    detail:null,
    content:'',//评价内容
    rate:'',//评分
    images:[]//评论图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id})
    this.getdetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  getdetail(){
    wx.showLoading({
      title: '数据加载中',
    })
    wx.cloud.callFunction({
      name:'getdetail',
      data:{id:this.data.id}
    }).then(res=>{
      console.log(res)
      this.setData({detail:JSON.parse(res.result)})
      wx.hideLoading()
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '数据请求失败',
      })
    })
  },
  rateChange({ detail}){
    console.log(detail)
    this.setData({ rate: detail})
  },
  onContentChange({detail}){
    this.setData({content:detail})
  },
  uploadImg(){
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log('img',res)
        this.setData({images:[...this.data.images,...tempFilePaths]})
      }
    })
  },
  submit(){
    let promiseArr=[]
    //异步上传评价图片
    this.data.images.map(el=>{
      promiseArr.push(new Promise((resolve,reject)=>{
        let suffix=/\.\w+$/.exec(el)[0]
        console.log(suffix)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: el, // 文件路径
          success: res => {
            // get resource ID
            console.log(res.fileID)
            resolve()
          },
          fail: err => {
            // handle error
            reject()
          }
        })
      }))
    })
    Promise.all(promiseArr).then(res=>{
      console.log('all upload')
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
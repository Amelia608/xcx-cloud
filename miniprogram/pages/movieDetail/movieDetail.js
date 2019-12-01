// pages/movieDetail/movieDetail.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    detail:null,
    content:'',//评价内容
    rate:'',//评分
    images:[],//评论图片
    fileIds:[],//评价图片上传返回的ids
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
      mask:true
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
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    let promiseArr=[]
    //异步上传评价图片
    this.data.images.map(el=>{
      promiseArr.push(new Promise((resolve,reject)=>{
        // 获取图片名称的后缀名
        let suffix=/\.\w+$/.exec(el)[0]
        console.log(suffix)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: el, // 文件路径
          success: res => {
            this.setData({ fileIds: [...this.data.fileIds,res.fileID]})
            resolve()
          },
          fail: err => {
            // handle error
            reject()
          }
        })
      }))
    })
    //所有图片上传至数据库成功后提交评价内容
    Promise.all(promiseArr).then(res=>{
      db.collection('comment').add({
        data:{
          content:this.data.content,
          score:this.data.rate,
          movieId:this.data.id,
          images:this.data.fileIds
        },
        success:()=>{
          wx.hideLoading()
          wx.showToast({ title:'评价成功',icon:'none'})
        }
      })
     
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
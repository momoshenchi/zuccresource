// pages/detail/detail.js
const db = wx.cloud.database();
const f = db.collection("file");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:0,
      detailList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.id=parseInt(options.tid)
      this.getDetail()
  },
  getDetail(){
    f.where({
    "id":this.id
    }).get({
      success: (res) => {
        let detailList = res.data
        console.log(detailList)
        this.setData({
          detailList
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }
  ,
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
// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: [{
        "id": 0,
        "name": "登录"
      },
      {
        "id": 1,
        "name": "退出"
      }
    ],
    user: {},
    log: app.globalData.logged

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  defaultLogin: function (e) {
    // console.log(e)
    let user = e.detail.userInfo;
    this.setData({
      user,
      log:true
    })
    app.globalData.userInfo = user;
    app.globalData.logged=true;
    wx.getSetting({
      success: res => {
        wx.cloud.callFunction({
          name: 'login',
          data: {
            getSelf: true
          },
          success: res => {  
            if (res.errMsg == "cloud.callFunction:ok"&&res.result){      
                //如果成功获取到
                //将获取到的用户资料写入app.js全局变量
                app.globalData.userId = res.result.data[0]._id;
                app.globalData.downloadList = res.result.data[0].downloadList
                app.globalData.collectList = res.result.data[0].collectList
            }
            else
            {
              wx.cloud.callFunction({
                name: 'login',
                data: {
                  setSelf: true,
                  userData:user
                },
                success:res=>{
                  console.log("add")
                }
            })
            }
          },
        
        })
      },
    })
  },
  exit()
  {
    app.globalData.userInfo = null;
    app.globalData.logged=false;
    app.globalData.userId =0;
    app.globalData.downloadList = []
    app.globalData.collectList = []
    this.setData({
      user:{},
      log:false
    })
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
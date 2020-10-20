wx - App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.cloud.init({
      env: "appyunappyun-5g9b6heh81f6fadf",
      traceUser: true
    })
,
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })
    
  },
  globalData: {
    //用户ID
      userId: '',
      //用户信息
      userInfo: null,
      //授权状态
      auth: {
       'scope.userInfo': false
      },
      //登录状态
      logged: false,
      downloadList:[],
      collectList:[]
    },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
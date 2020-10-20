const app = getApp();
const db = wx.cloud.database();
const talk = db.collection("talk");

Page({

 

toforum()
{
  if( app.globalData.logged==false)
  {
    wx.showModal({
      title: '提示',
      content: "请先在我的页面中登录",
      confirmColor: '#0bc183',
      confirmText: '知道了',
      showCancel: false
    });
  }
  else{
    wx.navigateTo({
      url: '/pages/forum/forum',
    })
  }
},
  formSubmit(e) {
    console.log(e.detail.value)
    wx.navigateTo({
      url: '/pages/find/find?find=' + e.detail.value.find, 
    })

  },
  /**
   * 页面的初始数据
   */
  data: {
 
    list: [],
    page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   
  },
  getitemList() {

    talk.get({
      success: res => {
        wx.setStorageSync('forumcontent', {
          time: Date.now(),
          data: res.data
        })
        // console.log(res)
        let list = res.data
        this.setData({
          list
        })
      }
    })
    wx.stopPullDownRefresh({
      success: (res) => {},
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
    const c = wx.getStorageSync('forumcontent') //使用超时缓存技术
    if (!c) {
      this.getitemList();
    } else {
      if (Date.now() - c.time > 20000) //大于20s,判断过期
      {
        this.getitemList();
      } else {
        let list = c.data
        this.setData({
          list
        })
      }
    }
      
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
  onPullDownRefresh() {
    this.setData({
      list:[],
      page:0
    })
    this.getitemList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("end")
    let page=this.data.page+20
    let list=this.data.list
    talk.skip(page).get({
      success: res => {
        let newList = res.data
        list=list.concat(newList)
        wx.setStorageSync('forumcontent', {
          time: Date.now(),
          data: list
        })
        this.setData({
          list,
          page
        })
        if(res.data.length==0)
        {
          wx.showToast({
            title: '已经没有更多内容了',
            icon:'none',
            duration: 1500
          })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
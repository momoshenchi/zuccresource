// pages/goods/goods.js

const db = wx.cloud.database();
const f = db.collection("file");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        isActive: true,
        value: "综合"
      }, {
        id: 1,
        isActive: false,
        value: "下载"
      },
      {
        id: 2,
        isActive: false,
        value: "最新"
      }
    ],
    goods_list: [],
    now_list: [],
    goodid: 0,
    cataid:  0
  },
  itemtap(e) {
    const index = e.target.dataset.idx;
    let {
      tabs
    } = this.data;
    for (var i = 0; i < tabs.length; ++i) {
      if (i == index) {
        tabs[i].isActive = true;
      } else {
        tabs[i].isActive = false;
      }
    }
    this.setData({
      tabs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goodid= parseInt(options.id)+1;
    this.cataid=  parseInt(options.cid)+1;
    this.getGoodList();
  },
  getGoodList() {
    f.where({
      "goodid": this.goodid,
      "catid": this.cataid
    }).get({
      success: (res) => {
        let goods_list = res.data
        this.setData({
          goods_list
        })
      },
      fail: (err) => {
        console.log(err)
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
      this.setData({
        goods_list:[]
      })
      this.getGoodList();
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
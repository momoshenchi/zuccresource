const db = wx.cloud.database();
const swiper = db.collection("swiper");
const cate = db.collection("category");
const file = db.collection("file");
wx - Page({


  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    cateList: [],
    contentList: [

    ]
  },
  upload() {
    wx.chooseMessageFile({
      type: 'file',
      success: chooseResult => {
        // 将图片上传至云存储空间    
        console.log(chooseResult)
        wx.cloud.uploadFile({
          // 指定上传到的云路径      
          cloudPath: 'cloud://appyunappyun-5g9b6heh81f6fadf.6170-appyunappyun-5g9b6heh81f6fadf-1303856757/file',
          // 指定要上传的文件的小程序临时文件路径     
          filePath: chooseResult.tempFiles[0].path, // 成功回调     
          success: res => {
            console.log('上传成功', res)
          },
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const c = wx.getStorageSync('swiper') //使用超时缓存技术
    if (!c) {
      this.getSwiperList();
    } else {
      if (Date.now() - c.time > 20000) //大于20s,判断过期
      {
        this.getSwiperList();
      } else {
        let swiperList = c.data
        this.setData({
          resourceList
        })
      }
    }
    this.getCateList();
    this.getContentList();
  },
  getSwiperList() {
    swiper.get({
      success: (res) => {
        wx.setStorageSync('swiper', {
          time: Date.now(),
          data: res.data[0].message
        })
        this.setData({
          swiperList: res.data[0].message
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  getCateList() {
    cate.get({
      success: (res) => {
        this.setData({
          cateList: res.data[0].message
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  getContentList() {
    file.get({
      success: (res) => {
        let contentList = res.data
        this.setData({
          contentList
        })
      },
      fail: (err) => {
        console.log(err)
      }
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
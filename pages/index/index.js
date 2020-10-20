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
    ],
    page:0
  },
  upload() {
    wx.showModal({
      title: '提示',
      content: '确定要上传吗',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          wx.chooseMessageFile({
            type: 'file',
            success: chooseResult => {
              wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
                title: "文件上传中",
                mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
              })
              // 将图片上传至云存储空间    
              console.log(chooseResult)
              wx.cloud.uploadFile({
                // 指定上传到的云路径      
                cloudPath: 'file/' + chooseResult.tempFiles[0].name,
                // 指定要上传的文件的小程序临时文件路径     
                filePath: chooseResult.tempFiles[0].path, // 成功回调     
                success: res => {
                  wx.hideLoading()
                  wx.showToast({
                    title: '上传成功',
                    duration: 1500
                  })

                  file.get({})
                },
                
                fail: err => {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
              })

            },
            fail: err => {
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              })
            }
          })
        } 
        else {
          console.log('用户点击取消')
        }
      }
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
          swiperList
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
    console.log("end")
    let page=this.data.page+20
    let contentList=this.data.contentList
    file.skip(page).get({
      success: (res) => {
        let newList = res.data
        contentList=contentList.concat(newList)
        this.setData({
          contentList,
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
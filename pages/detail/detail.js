// pages/detail/detail.js
const db = wx.cloud.database();
const f = db.collection("file");
const con = db.collection("file_con");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detailList: [],
    don: 0,
    many: {},
    content:[],
    goodrate:0,
    strrate:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id : parseInt(options.tid)
    })
  },
  getContent(){
    con.where({
      "id": this.data.id
    }).get({
        success:res=>{
          let many=res.data[0]
          let content=many.content
          let goodrate=many.goodrate
          let  strrate=Number(goodrate*100).toFixed(1);
          strrate+="%";
          this.setData({
            many,
            content,
            goodrate,
            strrate
          })
          console.log(strrate)
        },
        fail: (err) => {
          console.log(err)
        }
    })
  },
  peek() {
    let detailList=this.data.detailList
    wx.showModal({
      title: '提示',
      content: '确定要预览吗',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
            title: "文件加载中",
            mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
          })
          wx.cloud.downloadFile({
            fileID: detailList[0].url,
            success: res => {
              wx.openDocument({
                filePath: res.tempFilePath,
                success: res => {
                  console.log(res)
                  wx.hideLoading()
                },
                fail: err => {
                  wx.showToast({
                    title: '加载失败',
                    icon: 'none'
                  })
                },
              })
            },
            fail: err => {
              wx.showToast({
                title: '加载失败',
                icon: 'none'
              })
            },
          })
        } else {
          console.log("cancel")
        }
      }
    })
  },
  incr()
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
    let id = this.data.id;
    let good =this.data.many.good+1
    let bad=this.data.many.bad
    let rate=good/(good+bad)
    let  strrate=Number(rate*100).toFixed(1);
    strrate+="%";
    wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
      title: "评论上传中",
      mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
    })
    wx.cloud.callFunction({
      name: 'thumb',
      data: {
        good: true,
        "id": id,
        rate:rate
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '好评成功',
          icon:'success',
          mask:true
        })
        this.setData({
          goodrate:rate,
          strrate
        })
        this.getContent();
      }
    })}
  },
  desc()
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
    let id = this.data.id;
    let good =this.data.many.good
    let bad=this.data.many.bad+1
    let rate=good/(good+bad)
    let  strrate=Number(rate*100).toFixed(1);
    strrate+="%";
    wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
      title: "评论上传中",
      mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
    })
    wx.cloud.callFunction({
      name: 'thumb',
      data: {
        bad: true,
        "id": id,
        rate:rate
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '差评成功',
          icon:'success',
          mask:true
        })
        this.setData({
          goodrate:rate,
          strrate
        })
        this.getContent();
      }
    })}
  },
  getDetail() {
    f.where({
      "id": this.data.id
    }).get({
      success: (res) => {
        let detailList = res.data
        let don = detailList[0].downloadtimes
        let id=detailList[0].id
        this.setData({
          detailList,
          don,
          id
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  down() {
    let detailList = this.data.detailList;
    let id = this.data.id;
    let don = this.data.don + 1;
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
    wx.showModal({
      title: '提示',
      content: '确定要下载吗',
      success: (res)=> {
        if (res.confirm) {
          wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
            title: "文件下载中",
            mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
          })
          wx.cloud.downloadFile({
              fileID: detailList[0].url,
              success: result => {
                wx.getFileSystemManager().saveFile({
                  tempFilePath: result.tempFilePath, // 传入一个本地临时文件路径, 
                  filePath: wx.env.USER_DATA_PATH + '/downfile' + detailList[0].url.substr(detailList[0].url.length), //此处文件名自定义，需要加格式打开
                  success: (resl) => {
                    // console.log(resl) // res.savedFilePath 为一个本地缓存文件路径
                    wx.hideLoading()
                    wx.showModal({
                      title: '文件已保存到手机',
                      content: " 文件已保存至：" + "Android/data/com.tencent.mm/MicroMsg/wxanewfiles/******/",
                      confirmColor: '#0bc183',
                      confirmText: '知道了',
                      showCancel: false
                    });

                  },
                  fail: err => {
                    wx.hideLoading()
                    wx.showToast({
                      title: '下载失败',
                      icon: 'none'
                    })
                  },

                })
              },
              fail: err => {
                wx.hideLoading()
                wx.showToast({
                  title: '下载失败',
                  icon: 'none'
                })
              },
            });

            wx.cloud.callFunction({
              name: 'download',
              data: {
                cnt: don,
                id: id
              },
              success: res => {
                console.log(res)
                this.setData({ 
                  don
                })
              }
            });
            
        } 
      }
    })
  }
  },
  collect()
  {
    let detailList = this.data.detailList;
    let id = this.data.id;
    let cart=app.globalData.collectList
    if( app.globalData.logged==false)
    {
      wx.showModal({
        title: '提示',
        content: "请先在我的页面中登录",
        confirmColor: '#0bc183',
        confirmText: '知道了',
        showCancel: false
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '确定要收藏吗',
        success: (res)=> {
        if (res.confirm) {
        let flag=0;
        for(var i=0;i<cart.length;++i)
        {
          if(cart[i]==id)
          {
              flag=1;
              break;
          }
        }
        if(flag==1)
        {
          wx.showModal({
            title: '提示',
            content: "已经收藏过该资料",
            confirmColor: '#0bc183',
            confirmText: '知道了',
            showCancel: false
          })
        }
        else{
          app.globalData.collectList.push(id)
          wx.cloud.callFunction({
            name: 'collect',
            data: {
              "userid": app.globalData.userId,
              "id": id
            },
            success: res => {
              // console.log(res)
              wx.showToast({
                title: '加入成功',
                icon:'success',
                mask:true
              })
         
            }
          })
        }
      }}
    })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
   
    
      this.getDetail();
      this.getContent();
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
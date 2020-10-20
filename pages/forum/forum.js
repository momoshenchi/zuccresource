const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    titleDetail: "", //帖子title内容
    content: "", //发帖内容
    tempImg: [], //选择图片的缩略图，临时地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 检测输入字数
   * @param {object} e 
   */
  textareaCtrl: function (e) {
    if (e.detail.value) {
      this.setData({
        content: e.detail.value
      })
    } else {
      this.setData({
        content: ""
      })
    }
  },
  /**
   * 选择图片
   */
  choosePhoto() {
    let self = this;
    let tempImg = self.data.tempImg;
    if (tempImg.length > 2) {
      return;
    }
    wx.chooseImage({
      count: 3 - tempImg.length, //选择不超过3张照片,去掉当前已经选择的照片
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        tempImg = tempImg.concat(tempFilePaths);
        self.setData({
          tempImg
        })
        wx.getFileSystemManager().readFile({
          filePath: tempImg[0],
          success: buffer => {
            wx.cloud.callFunction({
              name: 'checkContent',
              data: {
                value: buffer.data
              },
              success:res=>{
                console.log(res.result.imageR)
                if (res.result.imageR.errCode == 87014) {
                  wx.showToast({
                    title: '图片含有违法违规内容',
                    icon: 'none'
                  });
                  console.log("invalid photo")
                } else {
                  //图片正常
                }
              }
            })
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 删除照片
   */
  removeImg(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    console.log(e);
    let tempImg = self.data.tempImg;
    tempImg.splice(index, 1);
    self.setData({
      tempImg
    })
  },
  getTitle(e)
  {
    if (e.detail.value) {
      this.setData({
        titleDetail: e.detail.value
      })
    } else {
      this.setData({
        contitleDetailtent: ""
      })
    }
  },
 
  submitPost(e) {
    
      let titleDetail=this.data.titleDetail;
      let tempImg=this.data.tempImg;
     let content=this.data.content;
     wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
      title: "正在发帖中",
      mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
    })
    wx.cloud.callFunction({
      name: 'checkContent',
      data: {
        txt: content
      },
      success:res=> {
        console.log(res)
        if(res.result.msgR!=false )
        {
         
              wx.cloud.callFunction({
                name:'submit',
                data:{
                  txt:content,
                  title:titleDetail,
                  username:app.globalData.userInfo.nickName,
                  photo:tempImg
                },
                success:res=>{
                  console.log(res)
                  wx.hideLoading()
                  wx.showToast({
                    title: '发帖成功',
                    icon:'success',
                    mask:true,
                    duration:1000
                  })
                  let pages = getCurrentPages();   //获取小程序页面栈
                  let beforePage = pages[pages.length -2];  
                  beforePage.getitemList();
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                   }, 1100) 
                 
                },
                fail:err=> {
                  wx.hideLoading()
                  console.log(err)
                }
              })
        }
        else
        {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: "请输入文本",
            confirmColor: '#0bc183',
            confirmText: '知道了',
            showCancel: false
          });
        }
      },
      fail:err=> {
        wx.hideLoading()
        console.log(err)
      }
    })
  }
})

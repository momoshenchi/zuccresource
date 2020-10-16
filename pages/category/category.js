// pages/category/category.js
const db = wx.cloud.database();
const rce = db.collection("resource");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		resourceList: [],
		right: [],
		currentindex: 0
	},

	//项目的点击事件
	itemtap(e) {
		const index = e.target.dataset.idx;
		let right = this.data.resourceList[index].children
		this.setData({
			currentindex: index,
			right
		})


	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const c = wx.getStorageSync('cates') //使用超时缓存技术
		if (!c) {
			this.getResourceList();

		}
		 else 
		{
			if (Date.now() - c.time > 20000) //大于20s,判断过期
			{
				this.getResourceList();
			} else {
				let resourceList = c.data
				let right = resourceList[0].children
				this.setData({
					resourceList,
					right
				})
			}
		}
	},
	getResourceList() {
		rce.get({
			success: (res) => {
				wx.setStorageSync('cates', {
					time: Date.now(),
					data: res.data[0].message
				})
				let resourceList = res.data[0].message
				let right = resourceList[0].children
				this.setData({
					resourceList,
					right
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
// pages/applist/applist.js
// const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tip:'本周末开会,大家不要回家哈！网络中心'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '应用列表'
    })
    app.checkLogin()
    var that = this
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/wx_users/gettip.php',
      success:function(res){
        // console.log(res.data.tip)
        that.setData({
          tip: res.data.tip
        })
        // console.log(that.data.tip)
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
    var that = this
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/wx_users/gettip.php',
      success: function (res) {
        // console.log(res.data.tip)
        that.setData({
          tip: res.data.tip
        })
        // console.log(that.data.tip)
      }

    })
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
  
  },
  searchdx:function(){
    wx.navigateTo({
      url: '../searchDX1/searchDX1'
    })
  },
  camera: function () {
    wx.navigateTo({
      url: '../camera/camera'
    })
  },
  ludan: function () {
    wx.navigateTo({
      url: '../ludan/ludan'
    })
  },
  searchStu: function () {
    wx.navigateTo({
      url: '../searchStu/searchStu'
    })
  },
  updx:function(){
    wx.navigateTo({
      url: '../updx/updx',
    })
  }
})
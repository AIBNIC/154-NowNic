// pages/worktable/worktable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:''
  },
  tel:function(e){
    console.log(e)

    wx.showModal({
      title: '拨打电话',
      content: e._relatedInfo.anchorTargetText + ' ' + e.currentTarget.dataset.tel,
      showCancel: true, //显示确定按钮
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel, //此号码并非真实电话号码，仅用于测试
            success: function () {
              console.log("拨打电话成功！")
            },
            fail: function () {
              console.log("拨打电话失败！")
            }
          })
        }
      },
      fail:function(error){
        console.log(error)
      }
    })
   
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
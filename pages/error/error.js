// pages/error/error.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    tower: [{
      id: 0,
      url: 'https://image.weilanwl.com/img/4x3-1.jpg'
    }, {
      id: 1,
      url: 'https://image.weilanwl.com/img/4x3-2.jpg'
    }, {
      id: 2,
      url: 'https://image.weilanwl.com/img/4x3-3.jpg'
    }, {
      id: 3,
      url: 'https://image.weilanwl.com/img/4x3-4.jpg'
    }, {
      id: 4,
      url: 'https://image.weilanwl.com/img/4x3-2.jpg'
    }, {
      id: 5,
      url: 'https://image.weilanwl.com/img/4x3-4.jpg'
    }, {
      id: 6,
      url: 'https://image.weilanwl.com/img/4x3-2.jpg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.towerSwiper('tower');
   
    // this.checkLogin();
    // var level = wx.getStorageSync('level')
    // console.log(level)
   
    
  },
  
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      towerList: list
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
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
    const that = this;
    wx.login({
      success: function (res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('code', res.code)

        var user_number = wx.getStorageSync('user_number')

        if (res.code) {
          wx.request({
            url: 'https://nic.fhyiii.cn/nic/xiaocx/get_openid.php', //改成你服务端的方法
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            dataType: "json",
            method: 'POST',
            data: {
              code: res.code,
              user_number: user_number
            },
            success: function (res) {
              // console.log(res)
              //如果是首次登录，会跳到授权页面
              if (res.data == 'error' || res.data == 'false') {
                wx.setStorageSync('user_state', 'false')
                console.log('app登录失败');
              } else {//o1RnE5H7yD9xqp-dKtj9R1M20GYg
                that.setData({
                  user: res.data
                })

                wx.setStorageSync('wx_user', res.data)

                wx.setStorageSync('user_name', res.data.user_name)
                wx.setStorageSync('user_number', res.data.user_number)
                wx.setStorageSync('user_password', res.data.user_password)
                wx.setStorageSync('user_floor', res.data.user_floor)
                wx.setStorageSync('user_identity', res.data.user_identity)
                wx.setStorageSync('user_state', res.data.wx_check)
                wx.setStorageSync('openid', res.data.wx_openid)
                wx.setStorageSync('wx_name', res.data.wx_name)
                wx.setStorageSync('wx_img', res.data.wx_img)
                wx.setStorageSync('level', res.data.level)

                console.log(res.data.level)
                if (res.data.level != 0) {
                  console.log("No 0")
                  wx.reLaunch({
                    url: '../fault/fault',
                  })

                }
                console.log('app登录成功');
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
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

  }
})
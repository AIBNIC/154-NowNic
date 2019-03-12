//获取应用实例
const app = getApp()

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    password: '',
    user: {
      'username': '',
      'password': ''
    }
  },
  
  // 更新用户帐号
  userID: function(e) {
    var that = this;
    that.setData({
      ['user.username']: e.detail.value,
    });
  },

  // 更新用户密码
  userPass: function(e) {
    var that = this;
    that.setData({
      ['user.password']: e.detail.value,
    });
  },

  // 校验用户登录信息是否符合规则
  checkUser: function() {
    wx.showLoading({
      title: '登陆中..'
    });
    var that = this;
    var username = that.data.user.username;
    var passwd = that.data.user.password;

    // 校验帐号是否符合11位数字的规则
    if (username.length != 11 || passwd.length === 0) {
      wx.showToast({
        title: '用户名出错',
        image: '../images/icon-error.png'
      })
      
    } else {
      this.login(); 
    }
  },

  // 登录事件
  login: function() {
    var that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/app_api/net_test/restful/login',
      method: 'POST',
      data: this.data.user,
      success: function(res) {

        wx.hideLoading();
        // 判断返回的数据是否登录成功
        if(res.data.uid) {
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            success: function () {
              that.mylocalStorage(res.data);
              
              wx.switchTab({
                url: '../usercenter/usercenter'
              });
            }
          })
        } else {
          app.errorMessge(JSON.parse(res.data).error);
        }
      }
    })
  },

  // 缓存用户信息
  mylocalStorage: function(data) {
    wx.setStorage({
      key: 'user_floor',
      data: data.user_floor
    });
    wx.setStorage({
      key: 'user_name',
      data: data.user_name
    });
    wx.setStorage({
      key: 'user_number',
      data: data.user_number
    });
    wx.setStorage({
      key: 'user_password',
      data: data.user_password
    });
    wx.setStorage({
      key: 'user_identity',
      data: data.user_identity
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '登陆中...'
    });
    
    try {
      var user = wx.getStorageSync('user_name')
      var pass = wx.getStorageSync('user_password')
      if (user != '' && pass != '') {
        wx.switchTab({
          url: '../usercenter/usercenter'
        });
      }else {
        wx.hideLoading()
      }
    } catch (e) {
      // Do something when catch error
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
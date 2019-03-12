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
    },
    code:''
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
    if (username.length === 0) {
      wx.showToast({
        title: '用户名不能为空',
        image: '../../images/icon-error.png'
      })
      return ;
    }
    if (username.length != 11 ) {
      wx.showToast({
        title: '用户名出错',
        image: '../../images/icon-error.png'
      })
      return;
    }
    if (passwd.length === 0) {
      wx.showToast({
        title: '密码不能为空',
        image: '../../images/icon-error.png'
      })
      return;
    } 
    if(username.length == 11 || passwd.length != 0) {
      this.login(); 
    }
  },

  // 登录事件
  login: function() {
    var isOutTime = true;
    var that = this;
    // console.log(this.data.code)
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/xiaocx/login.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        code: this.data.code,
        username: this.data.user.username,
        password: this.data.user.password
      },
      success: function(res) {
        isOutTime = false;
        wx.hideLoading();
        // 判断返回的数据是否登录成功
        if(res.data.uid) {
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            success: function () {
              console.log(res)
              wx.setStorageSync('user_state', 1)
              that.mylocalStorage(res.data);
              
              wx.switchTab({
                url: '../fault/fault'
              });
            }
          })
        } else {
          wx.showToast({
            title: '登录失败',
            image: '../../images/icon-error.png'
          })
          app.errorMessge(JSON.parse(res.data).error);
          
        }
      },
      complete: () => {
        wx.hideLoading()
        if (isOutTime) {
          console.log("请求超时！")
          app.prompt('请求超时！');
        }
        isOutTime = true; //无论如果都要返回true否则下次无法显示弹框了。
      },
    })
  },

  // 缓存用户信息
  mylocalStorage: function(data) {
    // wx.setStorageSync('user_floor', data.user_floor)
    // wx.setStorageSync('user_name', data.user_name)
    // wx.setStorageSync('user_number', data.user_number)
    // wx.setStorageSync('user_password', data.user_password)
    // wx.setStorageSync('user_identity', data.user_identity)
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
    console.log('login onLoad')
    var state = wx.getStorageSync('user_state');
    console.log(state)
    if(app.checkLogin()){
      console.log('自动登录成功')
      wx.switchTab({
        url: '../fault/fault',
      })
    } 
    //获取code
    var that = this;
    wx.login({
      success: function (res) {
        that.setData({
          code: res.code
        })
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
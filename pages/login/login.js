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
    code:'',

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
    // that.getCode();
  },
  // 校验用户登录信息是否符合规则
  checkUser: function() {
    wx.showLoading({
      title: '登陆中..'
    });
    var that = this;
    that.getCode();
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
    if (username.length < 5 ) {
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
    if(username.length >= 5 || passwd.length != 0) {
      this.login(); 
    }
  },
  getopenid:function(){
   
  },
  // 登录事件
  login: function() {
    var isOutTime = true;
    let that = this;
    that.getCode()


    if (!this.data.user.username){
      return false;
    } 

    // wx.getUserInfo({
    //   success(res) {
    //     console.log(res)
    //     wx.setStorageSync('userInfo_nickName', res.userInfo.nickName)
    //     wx.setStorageSync('userInfo_wx_img', res.userInfo.avatarUrl)
    //     console.log('获取用户信息成功')
    //   },
    //   fail(error) {
    //     console.log('获取用户信息失败')
    //   }
    // })

    // console.log(wx.getStorageSync('userInfo_nickName'))
    wx.request({
      // url: 'https://nic.fhyiii.cn/wxcx/public/index/login',
      url: 'http://127.0.0.1:8080/Wechat/login',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        code: this.data.code,
        xuehao: this.data.user.username,
        password: this.data.user.password,
        // userInfo_nickName: wx.getStorageSync('userInfo_nickName'),1
        // userInfo_wx_img: wx.getStorageSync('userInfo_wx_img')
      },
      
      success: function(res) {
        isOutTime = false;
        wx.hideLoading();
        console.log("data"+res.data);
        // 判断返回的数据是否登录成功
        if (res.data.errcode){
          // console.log("cuochu"+res.data.errcode);
          wx.showModal({
            title: '错误',
            content: '重启小程序',
            showCancel:false,
            success:function(res){
              if(!res.cancel){
                wx.redirectTo({
                  url: '../login/login',
                })
              }
            }
          })
        }
        if(res.data.success) {
          
          // if(res.data.user_name) {
          if (res && res.header && res.header['Set-Cookie']) {
            wx.setStorageSync('SessionId', res.data.SessionId);//保存Cookie到Storage
          } 
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            success: function () {
              // console.log(res.data)
              wx.setStorageSync('user_state', 1)
              that.mylocalStorage(res.data);
              console.log(wx.getStorageSync('user_floor'))
              console.log(res.data.success);
              wx.switchTab({

                url: '../fault/fault'
              });
            }  
          })
        } else {
          wx.vibrateLong();
          wx.showModal({
            title: '错误提示',
            content: res.data.msg+"",
            showCancel:false
          })
          // wx.showToast({
          //   title: res.data.msg,
          //   image: '../../images/icon-error.png'
          // })
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

  getCode:function(){
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
  // 缓存用户信息
 
  mylocalStorage: function(data) {
    wx.setStorageSync('wx_user', data.success)
    wx.setStorageSync('user_floor', data.user_floor)
    wx.setStorageSync('user_name', data.user_name)
    wx.setStorageSync('user_number', data.user_number)
    wx.setStorageSync('user_password', data.user_password)
    wx.setStorageSync('user_identity', data.user_identity)
    wx.setStorageSync('wx_img', data.wx_img)
    wx.setStorageSync('wx_name', data.wx_name)
    wx.setStorageSync('level', data.level)
    // wx.setStorage({
    //   key: 'user_floor',
    //   data: data.user_floor
    // });
    // wx.setStorage({
    //   key: 'user_name',
    //   data: data.user_name
    // });
    // wx.setStorage({
    //   key: 'user_number',
    //   data: data.user_number
    // });
    // wx.setStorage({
    //   key: 'user_password',
    //   data: data.user_password
    // });
    // wx.setStorage({
    //   key: 'user_identity',
    //   data: data.user_identity
    // });
    // var user = {data};
    // return user;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('login onLoad')
    // var state = wx.getStorageSync('user_state');
    // console.log(state)
    // if(app.checkLogin()){
    //   console.log('自动登录成功')
    //   wx.switchTab({
    //     url: '../fault/fault',
    //   })
    // } 
    this.getCode();
    wx.getUserInfo({
      success(res) {
        console.log("UserInfo->"+res)
        wx.setStorageSync('userInfo_nickName', res.userInfo.nickName)
        wx.setStorageSync('userInfo_wx_img', res.userInfo.avatarUrl)
        
        console.log('获取用户信息成功'+userInfo_nickName)
      },
      fail(error) {
        console.log('获取用户信息失败')
      }
    })

    this.towerSwiper('tower');
    // 初始化towerSwiper 传已有的数组名即可

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
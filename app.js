//app.js

App({
  // 判断返回的数据错误码提示

  errorMessge: function (error) {
    if (error === ('10001')) {
      wx.showToast({
        title: '没有故障',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10003')) {
      wx.showToast({
        title: '已经签到了',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10004')) {
      wx.showToast({
        title: '签到和签退不是同一天',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10005')) {
      wx.showToast({
        title: '帐号不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10006')) {
      wx.showToast({
        title: '已经签退了',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10007')) {
      wx.showToast({
        title: '月份不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10008')) {
      wx.showToast({
        title: '帐号不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10009')) {
      wx.showToast({
        title: '月份不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10010')) {
      wx.showToast({
        title: '签到方式不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10011')) {
      wx.showToast({
        title: '签到内容不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10016')) {
      wx.showToast({
        title: '锐捷用户不存在',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10017')) {
      wx.showToast({
        title: '锐捷用户不在线',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10018')) {
      wx.showToast({
        title: '密码不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10019')) {
      wx.showToast({
        title: '用户名或密码出错',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10020')) {
      wx.showToast({
        title: '数据库操作失败',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10021')) {
      wx.showToast({
        title: '已有此用户',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10022')) {
      wx.showToast({
        title: '帐号不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10024')) {
      wx.showToast({
        title: '栋数不能为空',
        image: '../../images/icon-error.png'
      })
    }
    if (error === ('10025')) {
      wx.showToast({
        title: '该栋数不存在',
        image: '../../images/icon-error.png'
      })
    }
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    user:"",
  },

  

  prompt: function (msg) {
    wx.showModal({
      title: msg,
      content: '请联系管理员！',
      showCancel:false
    })
  },
  update:function(){
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("新版本" + res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '下载提示',
        content: '新的版本下载失败',
        showCancel: false
      })
    })
  },
  //定时任务，每隔二十分钟刷新session 
  refresh:function(){
    var that = this;
    setInterval(that.login,20* 60 * 1000);
  },
  login: function (user_number, user_password){
    console.log('app-login')
    
    var that = this;
    var check;
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/log_login',
      method: 'POST',
      dataType: 'json',
      data: {
        xuehao: user_number,
        password: user_password,
      },
      success: function (res) {
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('SessionId', res.data.SessionId);//保存Cookie到Storage
        }
        if (res.data.success) {
          // console.log(res.data)
        } else {
          wx.clearStorageSync();
          wx.redirectTo({
            url: '../login/login',
          })
        }
      },
      error: function (error) {
        console.log(error)
      }

    })
  },
  onLaunch: function () {
    //获取字体
    wx.loadFontFace({
      family: 'webfont',
      source: 'url("//at.alicdn.com/t/webfont_1f7b3qbimiv.eot")',
      success: function (res) {
        console.log(res.status) //  loaded
      },
      fail: function (res) {
        // console.log(res.status) //  error
      },
      complete: function (res) {
        // console.log(res.status);
      }
    })
    // this.checkLogin();
    this.refresh(); //定时任务
    this.update();  //更新软件

    var wx_user = wx.getStorageSync('wx_user')
    this.login(wx_user.user_number, wx_user.user_password)

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = wx.getSystemInfoSync()['statusBarHeight'];
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // var checkLogin = this.checkLogin()
    // console.log(checkLogin)

    // if (checkLogin){
    //   this.globalData.user = this.checkLogin()
    //   this.login(this.globalData.user.user_number, this.globalData.user.user_password)
    // }
    // console.log(this.globalData)

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  
    
  },
  
  // 获取缓存里的用户信息,返回值是json格式的用户信息
  getLocaStroage: function(){
    console.log('调用app获取缓存')
    try {
      var name = wx.getStorageSync('user_name')
      var password = wx.getStorageSync('user_password')
      var floor = wx.getStorageSync('user_floor')
      var student = wx.getStorageSync('user_number')
      var identity = wx.getStorageSync('user_identity')
      var state = wx.getStorageSync('user_state')
      var wx_name = wx.getStorageSync('wx_name')
      var wx_img = wx.getStorageSync('wx_img')
      var level = wx.getStorageSync('level')
      var user = {
        name: name,
        password: password,
        floor: floor,
        student: student,
        identity: identity,
        state: state,
        wx_name: wx_name,
        wx_img: wx_img,
        level: level
      }
      return user
      console.log(user)
    } catch (e) { 
      console.log(e)
    }
  },
  
  // 判断用户是否登录
  checkLogin: function () {
    console.log('调用app判断用户是否登录checkLogin')
    var that = this;
    wx.login({
      success: function (res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('code', res.code)
        if (res.code) {
          wx.request({
            url: 'https://nic.fhyiii.cn/wxcx/public/index/getOpenid', //改成你服务端的方法
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            dataType: "json",
            method: 'POST',
            data: {
              'code': res.code,
            },
            success: function (res) {
              if (res && res.header && res.header['Set-Cookie']) {
                wx.setStorageSync('SessionId', res.data.SessionId);//保存Cookie到Storage
              }
              if (res.data.success) {
                // console.log(res.data)
                wx.setStorageSync('wx_user', res.data.msg)
                wx.setStorageSync('user_name', res.data.msg.user_name)
                wx.setStorageSync('user_number', res.data.msg.user_number)
                wx.setStorageSync('user_password', res.data.msg.user_password)
                wx.setStorageSync('user_floor', res.data.msg.user_floor)
                wx.setStorageSync('user_identity', res.data.msg.user_identity)
                wx.setStorageSync('user_state', res.data.msg.wx_check)
                wx.setStorageSync('openid', res.data.msg.wx_openid)
                wx.setStorageSync('wx_name', res.data.msg.wx_name)
                wx.setStorageSync('wx_img', res.data.msg.wx_img)
                wx.setStorageSync('level', res.data.msg.level)
                // console.log(res.data.msg)

                // if (res.data.msg.wx_img == '') {
                //   console.log('调用app没有授权')
                //   wx.redirectTo({
                //     url: '../login/login',
                //   })
                // }
                console.log('调用app判断用户成功');
              }else{
                wx.clearStorageSync();
                // wx.redirectTo({
                //   url: '../login/login',
                // })
              }
              
            }
          })
        } else {
          console.log('调用app获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // var user_state = wx.getStorageSync('user_state')
    // if (!user_state) {
    //   wx.redirectTo({
    //     url: 'pages/login/login',
    //     success: function () {
    //       wx.clearStorage()
    //     }
    //   })
    //   return false;
    // } 
    var wx_user = wx.getStorageSync('wx_user')
    that.globalData.user = wx_user
    // console.log(that.globalData)
  }
})
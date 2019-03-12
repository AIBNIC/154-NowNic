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
  prompt: function (msg) {
    wx.showModal({
      title: msg,
      content: '请联系管理员！',
      showCancel:false
    })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("新版本信息的回调"+res.hasUpdate)
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
  
  // 获取缓存里的用户信息,返回值是json格式的用户信息
  getLocaStroage: function(){
    console.log('app使用获取缓存')
    try {
      var name = wx.getStorageSync('user_name')
      var password = wx.getStorageSync('user_password')
      var floor = wx.getStorageSync('user_floor')
      var student = wx.getStorageSync('user_number')
      var identity = wx.getStorageSync('user_identity')
      var state = wx.getStorageSync('user_state')
      var user = {
        name: name,
        password: password,
        floor: floor,
        student: student,
        identity: identity,
        state: state
      }
      return user
    } catch (e) { 
      console.log(e)
    }
  },
  // 判断用户是否登录
  checkLogin: function () {
    console.log('判断用户是否登录开始')
    var that = this;
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
              if (res.data == 'error' || res.data == 'false' ) {
                // wx.clearStorage()
                wx.setStorageSync('user_state', 'false')
                console.log('判断用户失败');
              } else {//o1RnE5H7yD9xqp-dKtj9R1M20GYg
                wx.setStorageSync('user_name', res.data.user_name)
                wx.setStorageSync('user_number', res.data.user_number)
                wx.setStorageSync('user_password', res.data.user_password)
                wx.setStorageSync('user_floor', res.data.user_floor)
                wx.setStorageSync('user_identity', res.data.user_identity)
                wx.setStorageSync('user_state', res.data.wx_check)
                wx.setStorageSync('openid', res.data.wx_openid)
                console.log('判断用户成功');
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    var user_state = wx.getStorageSync('user_state')
    // console.log(user_state)
    if (user_state == 'false') {
      wx.redirectTo({
        url: '../login/login',
        success: function () {
          wx.clearStorage()
        }
      })
      return false;
    } 
    if (user_state == 1) {
      return true;
    } 
  }
})
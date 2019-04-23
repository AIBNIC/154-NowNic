// pages/usercenter/usercenter.js
const app = getApp();
const { $Message } = require('../../dist/base/index');
/**
 * 显示提示信息
 * tit 提示的标题
 * msg 提示的内容
 * q   是否有取消按钮（布尔值）
 * succ 用户点击确定的回调（非必须）
 * fail 用户点击取消的回调（非必须）
 *
 */
function show(tit, msg, q, succ, fail) {
  wx.showModal({
    title: tit,
    content: msg,
    showCancel: q,
    success: function (res) {
      if (res.confirm) {
        if (succ) {
          succ();
        }
      } else if (res.cancel) {
        if (fail) {
          fail();
        }
      }
    }
  })
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    
    actions: [
      {
        name: '喜欢你',
        color: '#fff',
        fontsize: '20',
        width: 100,
        icon: 'like',
        background: '#CC66FF'
      },
    ],

    // dsIndex: '',  // 栋数修改功能初始化键值下标
    // dsArray: ['13', '14', '18,19', '20,21', '22', '23', '24', '25', '26', '27'],  // 初始化栋数
    user: '',  // 用户信息
    hiddenmodalput: true,
    hiddenmodalDs: true,
    newPass: '',  // 保存在输入框里输入新的修改密码

    isfingerPrint: false,    //可否使用指纹识别  默认false
    isfacial: false,          //可否使用人脸识别  默认false
  },
  
  getUserinfo(){
    var that = this;
    
    wx.getUserInfo({
      success(res) {
        console.log(res)
        wx.showLoading({
          title: '稍等',
        })
        wx.request({
          url: 'https://nic.fhyiii.cn/wxcx/public/index/login',
          method:'POST',
          dataType:'json',
          data:{
            xuehao: that.data.user.user_number,
            password: that.data.user.user_password,
            code: that.data.code,
            userInfo_nickName: res.userInfo.nickName,
            userInfo_wx_img: res.userInfo.avatarUrl
          },
          success:function(res){
            if(res.data.success){
              if (that.checkLogin()) {
                // 将缓存里的信息存到data数据里
                that.setData({
                  user: wx.getStorageSync('wx_user')
                })
                console.log(that.data.user)
                wx.hideLoading()
              } 
            }
          }
        })
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender // 性别 0：未知、1：男、2：女
        const province = userInfo.province
        const city = userInfo.city
        const country = userInfo.country

      }
    })
  },
  //进行指纹识别 录入
  FingerPrint: function () {
    console.log(this.data)
    var that = this;
    wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: 'boringiii',
      authContent: '请用指纹',
      success(res) {
        // console.log("识别成功", json.cpu_id)
        var json = JSON.parse(res.resultJSON)
        console.log("识别成功", json)
        wx.request({
          url: 'https://nic.fhyiii.cn/nic/xiaocx/addfingerprint.php',
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            'user_number': that.data.user.student,
            'fingerprint': json.cpu_id,
          },
          success: function (data) {
            console.log(data.data)
            if (data.data.status) {
              show("提示", data.data.msg, false);
            }
            // var dataa = JSON.parse(data.data)
          },
          error: function (error) {
            console.log(error)
          }
        })

      },
      fail(res) {
        console.log("识别失败", res)
        show("提示", "识别失败", false);
      }
    })
  },
  //跳转到值班表页面
  worktable: function () {
    wx.navigateTo({
      url: '../worktable/worktable'
    })
  },
  // //跳转到录入个人信息页面
  // addUserinfo: function () {
  //   wx.navigateTo({
  //     url: '../adduserinfo/adduserinfo'
  //   })
  // },
  //跳转到开网信息录入页面
  goLoggingData : function() {
    wx.navigateTo({
      url: '../ludan/ludan'
    })
  },
  //跳转到用户查询页面
  searchStu: function () {
    wx.navigateTo({
      url: '../searchStu/searchStu'
    })
  },
  //跳转到上报电信页面
  updx: function () {
    wx.navigateTo({
      url: '../updx/updx'
    })
  },
  searchdx: function () {
    wx.navigateTo({
      url: '../searchdx/searchdx'
    })
  },
  qqmap: function () {
    wx.navigateTo({
      url: '../qqmap/qqmap'
    })
  },
  about: function() {
    wx.navigateTo({
      url: '../about/about'
    })
  },

  // 修改栋数弹窗选中的数据
  // bindPickerChange: function (e) {
  //   this.setData({
  //     dsIndex: e.detail.value
  //   })
  // },
  
  // 修改栋数弹窗
  // amendDs: function() {
  //   this.setData({
  //     hiddenmodalDs: !this.data.hiddenmodalDs
  //   })
  // },

 

  // 修改密码弹窗
  amendPassword: function() {
    // 点击修改密码按钮出现修改密码的弹窗
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  // 密码输入框输入新的密码时同步将数据存放在data数据里
  setNewPass: function(e) {
    this.setData({
      newPass: e.detail.value
    })
  },

  // 发送修改密码请求
  checkPass: function() {
    // 开启等待状态
    wx.showLoading({
      title: '修改中，请稍后...',
      mask: true
    })
    const that = this

    // console.log(that.data)


    var pass = this.data.newPass
    // var data = '{ "user_number": ' + that.data.user.student+ ', "user_password_old": ' + that.data.user.password + ', "user_password_new": ' + pass + ' }';

    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/changeKey',
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        user_number: that.data.user.user_number,
        password: that.data.user.user_password,
        newpassword: pass
      },
      success: function(res) {
        // 请求成功后取消等待状态
        wx.hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: res.data.msg
          })
          // 修改密码成功后取消弹窗，并清空data数据里保存的密码信息
          that.setData({
            hiddenmodalput: !that.data.hiddenmodalput,
            ['user.password']: pass,
            newPass: ''
          })
          // 同步修改缓存里的密码数据
          try {
            wx.setStorageSync('user_password', pass)
          } catch (e) {}

        } else {
          wx.showToast({
            title: res.data.msg,
            image: '../images/icon-error.png'
          })
        }
      }
    })
  },

  // 弹窗取消按钮事件
  cancel: function() {
    // 设置两个弹窗为true，全部隐藏
    this.setData({
      hiddenmodalput: true,
      hiddenmodalDs: true
    })
  },

  // 注销并清空缓存
  clearLocaStroage: function() {
    wx.showModal({
      title: '提示',
      content: '确定要注销？',
      success:function(res){
        if(res.cancel){

        }else{
          wx.reLaunch({
            url: '../login/login',
            success: function () {
              wx.clearStorage()
            }
          })
        }
      }
    })
    
  },
  
  // 判断用户是否登录
  checkLogin: function () {
    console.log('app开始自动登录')
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
              if (res.data == 'error' || res.data == 'false') {
                wx.setStorageSync('user_state', 'false')
                console.log('app登录失败');
              } else {//o1RnE5H7yD9xqp-dKtj9R1M20GYg
                that.setData({
                  user: res.data
                })
                // console.log(that.data.user)
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

                console.log('app登录成功');
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
      return false;
    }
    if (user_state == 1) {
      return true;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取code
    wx.login({
      success: function (res) {
        that.setData({
          code: res.code
        })
      }
    })

    //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        for (var i in res.supportMode) {
          if (res.supportMode[i] == 'fingerPrint') {
            console.log("支持指纹识别", res.supportMode[i]);
            that.setData({
              isfingerPrint: true
            })
          } else if (res.supportMode[i] == 'facial') {
            console.log("支持人脸识别", res.supportMode[i]);
          }
        }
      }
    })
    if (wx.getStorageSync('wx_user')) {
      that.setData({
        user: wx.getStorageSync('wx_user')
      })
      var wx_user = wx.getStorageSync('wx_user')
      // app.login(wx_user.user_number, wx_user.user_password)

      // 设置当前用户的栋数
      that.setData({
        user_floor: wx_user.user_floor
      })
    }
    
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   user: app.globalData.user
    // })
    this.setData({
      user: wx.getStorageSync('wx_user')
    })
    // console.log(this.data.user)
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

})
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
    user: {},  // 用户信息
    hiddenmodalput: true,
    hiddenmodalDs: true,
    newPass: '',  // 保存在输入框里输入新的修改密码

    isfingerPrint: false,    //可否使用指纹识别  默认false
    isfacial: false,          //可否使用人脸识别  默认false
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
  //跳转到查询电信页面页面
  searchdx: function () {
    wx.navigateTo({
      url: '../searchdx/searchdx'
    })
  },

  // 更新小程序版本
  updateNic: function() {
    wx.showLoading({
      title: '检查最新版本...',
      mask: true
    })
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if(!res.hasUpdate) {
        wx.hideLoading()
        wx.showToast({
          title: '当前版本为最新',
          icon: 'none'
        })
      }
    })

    updateManager.onUpdateReady(function () {
      // 当新版本下载完成，会进行回调
      wx.hideLoading()
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
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
      wx.showToast({
        title: '更新失败,检查网络状态',
        icon: 'none'
      })
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

  // 发送修改栋数请求
  // checkDs: function () {
  //   wx.showLoading({
  //     title: '修改中，请稍后...',
  //     mask: true
  //   })

  //   const that = this
  //   var data = '{ "user_number": ' + that.data.user.student + ', "user_floor": "' + that.data.dsArray[that.data.dsIndex] + '" }'

  //   wx.request({
  //     url: 'https://xzw.gdngs.cn/net_test/restful/info/2',
  //     method: 'POST',
  //     data: data,
  //     success: function (res) {
  //       wx.hideLoading()

  //       if (res.data.rs === 1) {
  //         wx.showToast({
  //           title: '修改成功',
  //           mask: true,
  //           success: function () {
  //             // 调用本页面里的注销按钮功能，清空缓存里保存的信息
  //             that.clearLocaStroage()
  //           }
  //         })
  //         // that.setData({
  //         //   hiddenmodalDs: !that.data.hiddenmodalDs,
  //         //   ['user.floor']: that.data.dsArray[that.data.dsIndex]
  //         // })
  //         // // 同步修改缓存里的栋数数据
  //         // try {
  //         //   wx.setStorageSync('user_floor', that.data.dsArray[that.data.dsIndex])
  //         // } catch (e) {
  //         // }
  //       } else {
  //         wx.showToast({
  //           title: '修改失败',
  //           image: '../images/icon-error.png'
  //         })
  //       }
  //     }
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
    var pass = this.data.newPass
    // var data = '{ "user_number": ' + that.data.user.student+ ', "user_password_old": ' + that.data.user.password + ', "user_password_new": ' + pass + ' }';

    wx.request({
      url: 'https://nic.fhyiii.cn/nic/xiaocx/change.php',
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        user_number: that.data.user.student,
        password: that.data.user.password,
        newpassword: pass
      },
      success: function(res) {
        // 请求成功后取消等待状态
        wx.hideLoading()

        if (res.data.error == '成功') {
          wx.showToast({
            title: '修改成功'
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
            title: '修改失败',
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
    wx.reLaunch({
      url: '../login/login',
      success: function() {
        wx.clearStorage()
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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
    // 校验是否登录
    if(app.checkLogin()) {
      var state = wx.getStorageSync('user_state');
      console.log(state)
      // 将缓存里的信息放在data数据里
      this.setData({
        user: app.getLocaStroage()
      })
      console.log(this.data.user)
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
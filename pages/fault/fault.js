// pages/fault/fault.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    user_floor: '',
    faultData: {},
    faultStatus: 0,
    user_num: '', 
    TabCur: 1,

    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 1,
    scrollLeft: 0,
    room: [
      {
        title: 'ALL'
      },
      {
        title: 13
      },
      {
        title: 14
      },
      {
        title: 18 + ',' + 19
      },
      {
        title: 20 + ',' + 21
      },
      {
        title: 22
      },
      {
        title: 23
      },
      {
        title: 24
      },
      {
        title: 25 + ',' + 26
      },
      {
        title: 27
      },
      

    ],
  },
  
  tabSelect(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var room = this.data.room[id].title
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      user_floor: room
    })
    
    this.judgeSearchFault(room)

    console.log(this.data.room[id].title)
    console.log(this.data)
  },
  tabSelect1(id) {
    var room = this.data.room[id].title
    console.log(room)
    this.setData({
      TabCur: id,
      scrollLeft: (id - 1) * 60,
      user_floor: room
    })
    
    this.judgeSearchFault(room)

  },


  // 弹出确认是否删除的弹窗
  checkDelFault: function (e) {
    const that = this
    var userName = e.target.dataset.username
    var faultId = e.target.dataset.faultid
    wx.showModal({
      title: '删除故障',
      content: '是否删除' + userName + '上报的故障',
      success: function (e) {
        if (e.confirm) {
          // 传入参数执行删除故障
          that.delFault(faultId)
        }
      }
    })
  },

  // 删除故障
  delFault: function (faultId) {
    wx.showLoading({
      title: '删除中，请稍侯...',
      mask: true
    })

    const that = this

    // 拼接数据
    var data = {
      "fault_id": faultId,
      "repair_id": that.data.user.user_number
    }

    // 发起删除故障的请求
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/editFault',
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.data.rs) {
          wx.hideLoading()
          // 删除故障后重新查询故障已达到页面自刷新
          for (var i = 0; i < that.data.room.length; i++) {
            if (that.data.room[i].title == that.data.user_floor) {
              that.tabSelect1(i)
            }
          }
        } else {
          // 执行报错
          app.errorMessge(error)
        }
      }
    })
  },

  // 查询故障
  searchFault: function (e) {
    const that = this;
    var ds = e.currentTarget.dataset.ds;  // 获取按钮里的data-ds数据
    // 切换当前激活的栋数
    that.setData({
      user_num: '',
      user_floor: e.currentTarget.dataset.ds
    })

    // 向服务器发起判断性查询故障请求
    that.judgeSearchFault(ds)
  },

  // 判断是双栋还是单栋查询
  judgeSearchFault: function (ds) {
    if (ds == 'ALL') {
      ds = ''
    }
    // 开启loading状态
    wx.showLoading({
      title: '故障查询中....',
      mask: true
    })

    const that = this
    var data = {}

    if (/,/g.test(ds)) {  // 当前查询的栋数是双栋
      ds = ds.split(',');
      var ds1 = '北区' + ds[0] + '栋'
      var ds2 = '北区' + ds[1] + '栋'
      var errorcount = 0;
      // 第一次查询
      wx.request({
        url: 'https://nic.fhyiii.cn/wxcx/public/index/showFault?floorId=' + ds1,
        success: function (res) {
          // console.log(res)
          if (res.data.error) {
            // 报错一次加1
            errorcount++
            that.setData({
              user_num: ''
            })
          } else {
            data = res.data
          }

          //  第二次查询
          wx.request({
            url: 'https://nic.fhyiii.cn/wxcx/public/index/showFault?floorId=' + ds2,
            success: function (res) {
              console.log(res)
              if (res.data.error) {
                errorcount++
                if (errorcount == 2) {
                  app.errorMessge(res.data.error);
                  that.setData({
                    faultStatus: 1,
                    user_num: ''
                  })
                } else {
                  that.setData({
                    faultData: data,
                    faultStatus: 2,
                    user_num: data.length
                  });
                }
              } else {
                console.log(Object.keys(data).length)
                console.log(Object.keys(res.data).length)
                //当第一栋没故障
                if (Object.keys(data).length == 0 && Object.keys(res.data).length != 0) {
                  that.setData({
                    faultData: res.data,
                    faultStatus: 2,
                    user_num: res.data.length
                  });
                } else {
                  data = data.concat(res.data)
                  that.setData({
                    faultData: data,
                    faultStatus: 2,
                    user_num: data.length
                  });
                }

              }
              // 关闭loading
              wx.hideLoading()
            }
          })
        }
      })

    } else {  // 当前查询的栋数是单栋或全部栋数
      // 当前查询的栋数是单栋时加上栋数
      if (ds != '') {
        ds = '北区' + ds + '栋'
      }

      wx.request({
        url: 'https://nic.fhyiii.cn/wxcx/public/index/showFault?floorId=' + ds,
        success: function (res) {

          if (res.data.error) {
            app.errorMessge(res.data.error);
            that.setData({
              faultStatus: 1,
              user_num: ''
            })
          } else {
            that.setData({
              faultData: res.data,
              faultStatus: 2,
              user_num: res.data.length
            });
            console.log(res.data.length + '个故障')
          }
          // 关闭loading
          wx.hideLoading()
        }
      })
    }
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
    if (user_state == 0) {
      return false;
    }
    if (user_state == 1) {
      return true;
    }
    
  },
  // 页面跳转到故障详情
  getUserFault: function (e) {
    const student = e.target.dataset.user;
    const name = e.target.dataset.username;
    const faultId = e.target.dataset.faultid;
    const faultTime = e.target.dataset.faulttime;
    console.log(e.target.dataset)
    wx.navigateTo({
      url: '../faultInfo/faultInfo?student=' + student + '&name=' + name + '&fault_id=' + faultId + '&fault_time=' + faultTime
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
    wx.setNavigationBarTitle({
      title: '校园网故障'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('检查')
    if (this.checkLogin()) {
      console.log('falut checklogin')
      const that = this;
      // 将缓存里的信息存到data数据里
      that.setData({
        user: app.getLocaStroage()
      })
      // if(that.data.user == ''){
      //   that.setData({
      //     user: app.getLocaStroage()
      //   })
      // }
      // console.log(that.data.user)
      if (that.data.user.level == 0) {
        wx.redirectTo({
          url: '../error/error',
        })
      }
      if (that.data.user.level != 0){
        for (var i = 0; i < that.data.room.length; i++) {
          if (that.data.room[i].title == that.data.user.floor) {
            this.tabSelect1(i)
          }
        }
      }

      // console.log(that.data.user.floor)

      // for (var i = 0; i < that.data.room.length; i++) {
      //   if (that.data.room[i].title == that.data.user.floor) {
      //     this.tabSelect1(i)
      //   }
      // }

      // 设置当前用户的栋数
      that.setData({
        user_floor: that.data.user.floor,
      })
      
      // 向服务器发起查询故障请求
      // this.judgeSearchFault(that.data.user.floor)
    } else {
      console.log('用户不存在')
      wx.reLaunch({
        url: '../login/login',
        success: function () {
          wx.clearStorage()
        }
      })
    }
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
  //转发
  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'AIB网络管理',
      path: '/pages/login/login',
      imgUrl: 'https://nic.fhyiii.cn/images/one.jpg',
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
})
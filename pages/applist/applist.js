const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    VerticalNavTop: 0,
    notice: "", //通知
    noticecolor: "", //通知
    room: [
      {
        title: 13
      },
      {
        title: 14
      },
      {
        title: 18
      },
      {
        title: 19
      },
      {
        title: 20
      },
      {
        title: 21
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
        title: 25
      },
      {
        title: 26
      },
      {
        title: 27
      },
      {
        title: 'ALL'
      },

    ],
    faultData: {},
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  //隐藏model
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //删除弹框
  checkDelFault(e) {
    const that = this;
    var faultId = e.target.dataset.faultid
    that.setData({
      modalName: "delModal",
      delfaultId:faultId
    })
    // console.log(that.data)
  },
  // 删除故障
  delFault: function () {
    const that = this
    that.hideModal()
    console.log(that.data.user)
    wx.showLoading({
      title: '删除中，请稍侯...',
      mask: true
    })

    // 发起删除故障的请求
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/editFault',
      method: 'POST',
      data: {
        repair_id: that.data.user.student,
        fault_id: that.data.delfaultId
      },
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
          // app.errorMessge(error)
        }
      }
    })
  },
  //查看详情
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
  tabSelect(e) {
    // console.log(e);
    // console.log(e.currentTarget.dataset.id)
    
    var id = e.currentTarget.dataset.id
    var room = this.data.room[id].title
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 60,
      user_floor: room,
      now_floor:room,
    })

    this.judgeSearchFault(room)
    console.log(this.data.user_floor)
    // console.log(this.data.room[id].title)
    // console.log(this.data)
  },
  tabSelect1(id) {
    var room = this.data.room[id].title
    this.setData({
      TabCur: id,
      VerticalNavTop: (id - 1) * 60,
      user_floor: room,
      now_floor: room,
    })
    console.log(this.data.user_floor)

    this.judgeSearchFault(room)

  },
  VerticalMain(e) {
    console.log(e.detail);
    console.log(this.data.VerticalNavTop);
  },
  onShow(){
    console.log(app.globalData)
    
    var that = this;
    that.setData({
      user: app.getLocaStroage()
    })

    that.setData({
      user_floor: that.data.user.floor,
    })

    if (!that.data.user.level){
      wx.redirectTo({
        url: '../login/login',
      })
    } else if(that.data.user.level == 0){
      wx.redirectTo({
        url: '../error/error',
      })
    }
    
    // if (that.data.user.level == 0) {
    //   wx.redirectTo({
    //     url: '../error/error',
    //   })
    // }

    console.log(that.data.user_floor)
    console.log(that.data.user)
    if (that.data.user.level != 0) {
      for (var i = 0; i < that.data.room.length; i++) {
        if (that.data.room[i].title == that.data.user.floor) {
          this.tabSelect1(i)
        }
      }
    }

    //公告
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/admin/admin/getNotice',
      method: 'GET',
      data: {},
      success: function (res) {
        that.setData({
          notice: res.data.msg,
          noticecolor: res.data.color
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
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
        url: "http://127.0.0.1:8080/Wechat/guZhang?"+ds1,
        success: function (res) {
          console.log(res.data)
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
            url: "http://127.0.0.1:8080/Wechat/guZhang?"+ds2,            
            success: function (res) {
              console.log(res.data)
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
        url: 'http://127.0.0.1:8080/Wechat/SearchGuZhang?' + ds,
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
})

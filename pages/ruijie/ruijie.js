// pages/ruijie/ruijie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_info: '',
    USERNAME: '无',
    USERID: '无',
    USERMAC: '无',
    USERIP: '无',
    NASIP: '无', //设备IP
    NASPORT: '无', //设备端口
    GATEWAY: '无', //网关IP
    LOGINTIME: '无', //登陆时间
    stu_room: '无', //宿舍号
    stu_start_time: '无', //开通时间
    stu_end_time: '无', //到期时间
    enkey: '无', //密钥
    stu_number:null,
    date:'2018-9-30',
    date_man:'',
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    console.log(this.data.date)
  },
  bindChange: function (e) {
    this.setData({
      search_info: e.detail.value
    })
    // console.log(1)
    // console.log(this.data.search_info)
  },
  man_input:function(e){
    this.setData({
      date_man: e.detail.value
    })
    console.log(this.data.date_man)
  },
  search_ruijie:function(){
    wx.showLoading({
      title: '查询中',
    })
    var search_info = this.data.search_info
    
    // console.log(search_info)
    var that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/ruijie-del/php/search_info.php',  //查询设备IP 设备端口 MAC
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        stuNumber : search_info
      },
      success:function(res){
        console.log(res)
        that.setData({
          USERNAME: res.data[0].USERNAME,
          USERID: res.data[0].USERID,
          USERMAC: res.data[0].USERMAC,
          NASIP: res.data[0].NASIP,
          NASPORT: res.data[0].NASPORT,
        })
        wx.setStorage({
          key: 'stuNumber',
          data: res.data[0].USERID,
        })
        // console.log(that.data.USERNAME)
      }
    })
    //20175533426
      wx.request({
        url: 'https://nic.fhyiii.cn/nic/ruijie-del/php/search_online.php',  //查询设备IP 设备端口 MAC
        data: {
          stuNumber: search_info
        },
        success: function (res) {
          console.log(res)
          that.setData({
            GATEWAY: res.data.GATEWAY,
            LOGINTIME: res.data.LOGINTIME,
            USERIP: res.data.USERIP,
          })
          // console.log(that.data.USERNAME)
        }
      })

    wx.request({
      url: 'https://nic.fhyiii.cn/nic/ruijie-del/php/search_time.php',  //查询设备IP 设备端口 MAC
      data: {
        stuNumber: search_info
      },
      success: function (res) {
        console.log(res)
        that.setData({
          stu_number: res.data.stu_number,
          stu_room: res.data.stu_room,
          stu_start_time: res.data.stu_start_time,
          stu_end_time: res.data.stu_end_time,
          enkey: res.data.enkey,
        })
        wx.hideLoading()
        // console.log(that.data.USERNAME)
      }
    })
    console.log(that.data)
  },
  remove_ip:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '真的要请IP？',
      // showCancel: false, //显示确定按钮
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://nic.fhyiii.cn/nic/ruijie-del/php/wx_remove_online.php',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            data: {
              ONLINEUSERID: that.data.USERID
            },
            success: function (res) {
              // console.log(res)
              if(res.data.success){
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 500
                })
              }else{
                wx.showModal({
                  title: '失败提示',
                  content: res.data.msg,
                  showCancel: false, //显示确定按钮
                  success: function (res) {
                  }
                })
              }
            }
          })
          console.log('请IP')
        }
      }
    })
  },
  remove_lou: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '真的要清除楼层？',
      // showCancel: false, //显示确定按钮
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://nic.fhyiii.cn/nic/ruijie-del/php/wx_reset_user_info.php',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            data: {
              ONLINEUSERID: that.data.USERID
            },
            success: function (res) {
              console.log(that.data.stu_number)
              if (res.data.success) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 500
                })
              } else {
                wx.showModal({
                  title: '失败提示',
                  content: res.data.msg,
                  showCancel: false, //显示确定按钮
                  success: function (res) {
                  }
                })
              }
            }
          })
          console.log('清除楼层')
        }
      }
    })
  }, 
  changeDate: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '真的要修改日期？',
      // showCancel: false, //显示确定按钮
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://nic.fhyiii.cn/nic/ruijie-del/php/wx_update_end_time.php',
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
              ONLINEUSERID: that.data.stu_number,
              end_time: that.data.date,
              update_user: that.data.date_man,
            },
            success: function (res) {
              console.log(that.data.stu_number)
              if (res.data.success) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 500
                })
              } else {
                wx.showModal({
                  title: '失败提示',
                  content: res.data.msg,
                  showCancel: false, //显示确定按钮
                  success: function (res) {
                  }
                })
              }
            }
          })
          console.log('修改日期')
        }
      }
    })
  },
  remove_user:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '真的要删除用户？',
      // showCancel: false, //显示确定按钮
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://nic.fhyiii.cn/nic/ruijie-del/php/wx_remove_user.php',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            data: {
              ONLINEUSERID: that.data.stu_number
            },
            success: function (res) {
              console.log(that.data.stu_number)
              if (res.data.success) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 500
                })
              } else {
                wx.showModal({
                  title: '失败提示',
                  content: res.data.msg,
                  showCancel: false, //显示确定按钮
                  success: function (res) {
                  }
                })
              }
            }
          })
          console.log('删除用户')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '电信账号查询'
    })
    // wx.clearStorageSync();
    var user = wx.getStorageSync('user_name');
    console.log('缓存'+user)
    this.setData({
      date_man: user
    })
    console.log(this.data.date_man)
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
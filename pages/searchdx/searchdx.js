// pages/searchdx/searchdx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //在线人数
    onLine:[],
    loading:null,
    cxnumber:'',
    stuName:'',
    stuId: '',
    stuNumber: '',
    stuSpeed: 'LAN1M',
    stuState: '',
    array:[],

    user:'',
    resultCode:'',  //返回码
    reason:'',     //错误原因
    rechargeNbr:'',  //手机号
    totalBalance:'', //欠费多少

    dx_id:'',
    dx_state:'',
    dx_time: '',
  },
  cxnumber: function (e) {
    // console.log(e.detail.value)
    this.setData({
      cxnumber: e.detail.value
    })
    this.setData({
      resultCode: '',
      reason: '',
      stuName: '',
      totalBalance: '',
      rechargeNbr: '',

      dx_state:'',

    })
  },
  //查询
  searchTap: function () {
    if (this.data.cxnumber == "") {
      wx.showToast({
        title: '不能为空',
        image: '../../images/icon-error.png'
      })
      return false;
    }
    this.setData({ loading: true })
    console.log(this.data.cxnumber)

    let that = this

    if (/^1[34578]\d{9}$/.test(this.data.cxnumber)) {
      wx.request({
        url: 'https://nic.fhyiii.cn/wxcx/public/index/SearchDxMoney',
        method: 'POST',
        header: {
          "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId"),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          phone: this.data.cxnumber,
          user: this.data.user
        },
        success: function (res) {
          that.setData({ loading: false })
          console.log(res.data)
          if (res.data.resultCode != 0) {
            console.log("有问题")
            that.setData({
              resultCode: res.data.resultCode,
              reason: res.data.reason,
              totalBalance: res.data.totalBalance / 100,
            })
          } else {
            that.setData({
              resultCode: res.data.resultCode,
              reason: res.data.reason,
              stuName: res.data.custName,
              totalBalance: res.data.totalBalance / 100,
              rechargeNbr: res.data.rechargeNbr,
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
    
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/searchDx',
      header: {
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId"),
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        info:this.data.cxnumber,
        user: this.data.user
      },
      method: 'POST',
     
      //20175533426，20175533441 方宏毅 林泽文
      //20162204169
      success:function(res){
        if (res.data == null){
          wx.showToast({
            title: '账号不存在',
            image: '../../images/icon-error.png'
          })
          this.setData({ stuName: '查无此人' })
          this.setData({ stuId: null })
          this.setData({ stuNumber: null })
          this.setData({ stuSpeed: null })
          this.setData({ stuState: null })
        }else{
          var result = res.data.msg;
          if (result.user_number != "") {
            this.setData({ stuName: result.user_name })
            this.setData({ stuId: result.user_id })
            this.setData({ stuNumber: result.user_number })
            this.setData({ stuSpeed: result.user_speed })
            this.setData({ stuState: result.user_state })
          } else {
            this.setData({ stuName: '查无此人' })
            this.setData({ stuId: '未知' })
            this.setData({ stuNumber: '未知' })
            this.setData({ stuSpeed: '速率未知' })
            this.setData({ stuState: '状态未知' })
            // this.setData({ loading: false })
          }
        }
        console.log(this.data)
      }.bind(this),
      fail:function(err){
        console.log(err)
      }
    })
    // 20175533426
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/searchUserOnline',
      method: 'POST',
      header: { 
        'content-type': 'application/x-www-form-urlencoded' ,
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
      },
      data: {
        info: this.data.cxnumber,
        user: this.data.user
        // key:'search',
        // user: this.data.user
      },
      success: function (res) {
        that.setData({ loading: false })
        console.log(res.data)
        if (res.data.success) {
          that.setData({
            dx_id: res.data.info,
            dx_state: '在线', 
            dx_time: res.data.start_time, 
          })
        }else{
          that.setData({
            dx_id: '',
            dx_state: res.data.msg,
            dx_time: '', 
          })
        }

      },
      fail: function (err) {
        console.log(err)
      }
    })

    //查询学生
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/StudentInfo',
      header: {
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId"),
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        content: this.data.cxnumber,
        user: this.data.user
      },
      method: 'POST',

      //20175533426，20175533441 方宏毅 林泽文
      //20162204169
      success: function (res) {
        if (res.data == false) {
          // that.handleError();
          // wx.hideLoading();
          return false;
        } else {
          that.setData({
            stuName: res.data.stu_name,
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },

  //下线
  outUser:function(event){
    wx.showLoading({
      title: '下线中',
    })
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/outUser',
      method: 'POST',
      header: { 
        'content-type': 'application/x-www-form-urlencoded',
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
       },
      data: {
        info: event.currentTarget.dataset.dx_id,
        key: 'delUser',
        user: this.data.user
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data)
        if (res.data.success) {
          wx.showToast({
            title: '下线成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
        }

      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title: '电信相关信息查询'
    })
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/dxonLine',
      header: { "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")},
      method: 'GET',
      success: function (res) {
        this.setData({ onLine: res.data.online })
        console.log(res.data.online)
      }.bind(this)
    })
    // var i = setInterval(function () {
    //   wx.request({
    //     url: 'https://nic.fhyiii.cn/dx/dx_pachong/online.php',
    //     method: 'GET',
    //     success: function (res) {
    //       this.setData({ onLine: res.data.online })
    //       console.log(res.data.online)
    //     }.bind(this)
    //   })
    // }.bind(this), 5000);
    var user = wx.getStorageSync('user_name');
    this.setData({
      user:user
    })
    // console.log(user)
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
  // onShareAppMessage: function () {
  
  // },
  
})
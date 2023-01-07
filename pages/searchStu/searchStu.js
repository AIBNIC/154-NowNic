// pages/searchStu/searchStu.js
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');

const app = getApp()


//查询ID 获取电信号码 去查询
function searchId(dx_uid,that){
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/dx/searchID',  //查询设备IP 设备端口 MAC
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      id: dx_uid,
      user: that.data.user
    },
    success: function (res) {
      // console.log(res)
      if(res.data.user_number != ''){
        search8M(res.data.user_number,that)
      }
      
    },
    fail:function(err){
      console.log(err)
    }
  })
}
//8M 查名字
function searchName(stu_name,that){
  var dx = that.data.dx
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/searchName',  //查询设备IP 设备端口 MAC
    header: {          
      "Content-Type": "application/x-www-form-urlencoded",         
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")       
    },
    method: 'POST',
    data: {
      info: stu_name,
      user: that.data.user
    },
    //20175533426
    success: function (res) {
      // console.log(res)
      if (res.data.uid != '') { // 判断是否查询到
        searchId(res.data.uid, that)
        
      }
    },
    fail:function(){
      that.handleError()
    }
  })
}
//8M 
function search8M(user_number, that) {
  var dx = that.data.dx
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/searchDx',  //查询设备IP 设备端口 MAC
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      info: user_number,
      user: that.data.user
    },
    success: function (res) {
      if (res.data.userid != '查询结果为空') { // 判断是否查询到
        // if (res.data.length){
        //   for (var i = 0; i < res.data.length; i++) {
        //     if (res.data[i].user_cid === '') {  // 无此用户时
        //       that.setData({
        //         ['dx[' + i + ']']: '无此用户'
        //       })
        //     } else {  // 搜索到用户信息
        //       wx.vibrateShort();
        //       that.handleSuccess()
        //       that.setData({
        //         ['dx[' + i + ']']: res.data[i]
        //       })

        //       // 处理身份证后八位
        //       that.setData({
        //         ['dx[' + i + '].user_cid2']: that.data.dx[i].user_cid.slice(11, 19)
        //       })
        //     }
        //   }
        // }else{
          that.handleSuccess()
          wx.vibrateShort();

          that.setData({
            'dx[0]': res.data
          })
          // console.log(that.data)

          // 处理身份证后八位
          that.setData({
            ['dx[0].user_cid2']: that.data.stu_idcard.slice(10, 19)
          })
        // }
        console.log(that.data)
      }else{
        // that.handleError8M()
        that.setData({
          'dx': ''
        })
      }
    },
    fail:function(){
      that.handleError()
    }
  })
}
//学号 电信2M
function searchNumber(user_number, that) {
  var dx1 = that.data.dx1
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/searchDx',  //查询设备IP 设备端口 MAC
    header: {          
      "Content-Type": "application/x-www-form-urlencoded",         
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")       
    },
    method: 'POST',
    data: {
      info: user_number,
      user: that.data.user
    },
    //201755334
    success: function (res) {
      if (res.data.userid != '查询结果为空'){
          that.handleSuccess()
          wx.vibrateShort();

          that.setData({
            'dx1[0]': res.data
          })
          // 处理身份证后八位
          that.setData({
            ['dx1[0].user_cid2']: that.data.stu_idcard.slice(10, 19)
          })
      }else{
        that.handleError2M()
        that.setData({
          'dx1': ''
        })
      }
      console.log(that.data)
    },
    fail:function(err){
      console.log(err)
    }
  })
}
//查询宿舍修改次数
function searchRoom(user_number, that) {
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/selectRoom',
    header: {          
      "Content-Type": "application/x-www-form-urlencoded",         
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")       
    },
    method: 'POST',
    data: {
      xuehao: user_number,
      user: that.data.user
    },
    success: function (res) {
      if (res.data.status) {
        that.setData({
          stu_rooms: res.data.msg
        })
      } 
    },
    fail:function(res)
    {
      console.log(res)
    }
  })
}

//查询安朗到期
function searchAbms(user_number, that){
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/getStudentState ',
    header: {          
      "Content-Type": "application/x-www-form-urlencoded",      
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      xuehao: user_number,
      user: that.data.user
    },
    success: function (res) {//400002 无用户  100002 成功
      if (res.data.status) {
        if(res.data.msg == 1){
          that.setData({
            stu_state:'移动',
            stu_end_time: res.data.date
          })
        }
        
        if (res.data.msg == 2) {
          that.setData({
            stu_state: '电信',
            stu_end_time: res.data.date
          })
        }
      } 
    }
  })
}

//查询安朗在线
function searchAbmsIP(user_number, that) {
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/searchUserOnline',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    method: 'POST',
    data: {
      userid: user_number,
      user: that.data.user
    },
    success: function (res) {//400002 无用户  100002 成功
      if (res.data.status) {
          that.setData({
            stu_ip: res.data.ip
          })
      }else{
        that.setData({
          stu_ip: res.data.msg
        })
      }
    }
  })
}

Page({

  handleLoadingT() {
    $Toast({
      content: '修改中',
      type: 'loading'
    });
  },
  changeSuccess() {
    $Toast({
      content: '成功了！耶！',
      type: 'success'
    });
  },
  handleErrorT() {
    $Toast({
      content: '错误了！',
      type: 'error'
    });
  },
  handleSuccess() {
    $Message({
      content: '电信查询成功',
      type: 'success'
    });
  },
  handleError8M() {
    $Message({
      content: '查询不到8M',
      type: 'error'
    });
  },
  handleError2M() {
    $Message({
      content: '查询不到2M',
      type: 'error'
    });
  },
  handleError() {
    $Message({
      content: '错误!!!',
      type: 'error'
    });
  },
  handleDuration() {
    $Message({
      content: '等待三秒',
      duration: 3
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    search_info:'',
    stu_idcard:'',
    stu_idcard1: '',
    stu_major:'',
    stu_name:'',
    stu_number:'',
    stu_end_time:'',
    stu_room:'',
    stu_rooms: '', //宿舍修改次数
    stu_state: '电信', //用户类型
    dx:[],
    dx1:[],
    
  },
  //输入框修改变动
  bindChange: function (e) {
    this.setData({
      search_info: e.detail.value,
      stu_idcard: '',
      stu_idcard1: '',
      stu_major: '',
      stu_name: '',
      stu_number: '',
      stu_end_time: '',
      stu_room: '',
      stu_rooms: '', //宿舍修改次数
      dx: [],
      dx1: [],
    })
    // console.log(this.data.search_info)
  },
  //查询学生
  search_Stu:function () {
    var that = this;
    console.log(that.data)
    that.data.dx = [];
    that.data.dx1 = [];
    
    // this.handleDuration()

    var search_info = this.data.search_info
    if (search_info == '' ){
        return ;
    }
    wx.showLoading({
      title: '查询中',
    })
   
    // console.log(search_info)
    
    //查询学生信息，姓名，学号，班级，身份证
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/StudentInfo',  //查询设备IP 设备端口 MAC
      header: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
      },
      method: 'POST',
      data: {
        content: search_info,
        user: that.data.user
      },
      //20175533426
      success: function (res) {
        // console.log(res.data)
        if (res.data == false){
          that.handleError();
          wx.hideLoading();
          return false;
        }else{
          wx.vibrateShort();

          that.setData({
            stu_idcard: res.data.stu_idcard,
            stu_idcard1: res.data.stu_idcard.slice(10, 19),
            stu_major: res.data.stu_major,
            stu_name: res.data.stu_name,
            stu_number: res.data.stu_number,
            stu_end_time: res.data.stu_end_time,
            stu_room: res.data.stu_room,
          })
          wx.hideLoading()
          searchName(res.data.stu_name, that)
          searchNumber(res.data.stu_number, that)
          searchAbms(res.data.stu_number, that)
          searchRoom(res.data.stu_number, that)
          searchAbmsIP(res.data.stu_number, that)
        }
      }
    })
  },

  //重置宿舍修改次数
  resetRoom(){
    this.handleLoadingT();
    let that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/updateRoom',
      header: {          
        "Content-Type": "application/x-www-form-urlencoded",         
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")       
      },
      method: 'POST',
      data: {
        xuehao: this.data.stu_number
      },
      success: function (res) {
        if (res.data.status) {
          that.changeSuccess();
          that.setData({
            stu_rooms: 1
          })
        }else{
          that.handleErrorT();
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  //安朗
  offLine(){
    let that = this;
    // wx.showLoading({
    //   title: '稍等中',
    // })
    that.handleLoadingT()
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/Wechat/offLineUser',
      method: 'POST',
      data: {
        userid: this.data.stu_number
      },
      success(res) {
        if (res.data.data == 1) {
          that.changeSuccess();
        } else {
          that.handleErrorT()
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  //修改为默认密码 8M
  changemima: function () {
    this.handleLoadingT()
    var that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/reset',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")  
      },
      data: {
        'info': this.data.dx[0].user_number,
        'password': 'A' + this.data.dx[0].user_cid2,
        'user': that.data.user
      },
      success: function (res) {
        console.log(res)
        if (res.data.success == true) {
          that.changeSuccess()
        } else {
          that.handleErrorT()
          
        }
      }
    })
  },
  //修改为默认密码 2M
  changemima_2m: function () {
    this.handleLoadingT()
    var that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/wxcx/public/index/reset',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")  
      },
      data: {
        'info': this.data.dx1[0].user_number,
        'password': 'A' + this.data.stu_idcard1,
        'user': that.data.user
      },
      success: function (res) {
        console.log(res)
        if (res.data.success == true) {
          that.changeSuccess()
        } else {
          that.handleErrorT()
        }
      }
    })
  },
  //手动报故障
  // upfault:function(){
  //   wx.navigateTo({
  //     url: '../upfault/upfault?username=' + this.data.stu_name + '&&stu_number=' + this.data.stu_number + '&&stu_room=' + this.data.stu_room,
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.checkLogin()
    try {
      var user = wx.getStorageSync('user_name')
      // console.log(wx.getStorageSync('level'))
      if (user == '' || user == 'undefined') {
        wx.switchTab({
          url: '../login/login'
        });
      } else {
        console.log(user)
        this.setData({
          user:user,
          userlevel: wx.getStorageSync('level')
        })
      }
    } catch (e) {
      console.log(e)
      // Do something when catch error
    }
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

  // }
})
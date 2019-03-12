// pages/searchStu/searchStu.js
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');

const app = getApp()
//8M 查名字
function searchName(stu_name,that){
  var dx = that.data.dx
  wx.request({
    url: 'https://nic.fhyiii.cn/dx/dx_pachong/search.php',  //查询设备IP 设备端口 MAC
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    method: 'POST',
    data: {
      info: stu_name
    },
    //20175533426
    success: function (res) {
      if (res.data.success) { // 判断是否查询到
        for (var i = 0; i < res.data.msg.length; i++) {
          if (res.data.msg[i].user_cid === '') {  // 无此用户时
            that.setData({
              ['dx[' + i + ']']: '无此用户'
            })
          } else {  // 搜索到用户信息
            that.handleSuccess()
            that.setData({
              ['dx[' + i + ']']: res.data.msg[i]
            })

            // 处理身份证后八位
            that.setData({
              ['dx[' + i + '].user_cid2']: that.data.dx[i].user_cid.slice(11, 19)
            })
          }
        }
      }
      console.log(dx)
    },
    // fail:function(){
    //   that.handleError()
    // }
  })
}
//学号 电信2M
function searchNumber(user_number, that) {
  var dx1 = that.data.dx1
  wx.request({
    url: 'https://nic.fhyiii.cn/dx/dx_pachong/search.php',  //查询设备IP 设备端口 MAC
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    method: 'POST',
    data: {
      info: user_number
    },
    //20175533426
    success: function (res) {
      if (res.data.success) { // 判断是否查询到
        for (var i = 0; i < res.data.msg.length; i++) {
          if (res.data.msg[i].user_cid === '') {  // 无此用户时
            that.handleSuccess()
            that.setData({
              ['dx1[' + i + ']']: '无此用户'
            })
          } else {  // 搜索到用户信息
            that.handleSuccess()
            that.setData({
              ['dx1[' + i + ']']: res.data.msg[i]
            })

            // 处理身份证后八位
            that.setData({
              ['dx1[' + i + '].user_cid2']: that.data.dx1[i].user_cid.slice(11, 19)
            })
          }
        }
      }
      console.log(dx1)
    }
  })
}
//查询宿舍修改次数
function searchRoom(user_number, that) {
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/selectRoom',
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    method: 'POST',
    data: {
      xuehao: user_number
    },
    success: function (res) {
      if (res.data.status) {
        that.setData({
          stu_rooms: res.data.msg.rooms
        })
      } 
    },
    fail:function(res)
    {
      console.log(res)
    }
  })
}

function searchAbms(user_number, that){
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/getStudentState ',
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    method: 'POST',
    data: {
      xuehao: user_number
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
      url: 'https://nic.fhyiii.cn/nic/searchStu/search.php',  //查询设备IP 设备端口 MAC
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        content: search_info,
        user: that.data.user
      },
      //20175533426
      success: function (res) {
        console.log(res.data)
        if (res.data == false){
          that.handleError();
          wx.hideLoading();
          return false;
        }else{
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
      header: { "Content-Type": "application/x-www-form-urlencoded" },
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
  //修改为默认密码 8M
  changemima: function () {
    this.handleLoadingT()
    var that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/dx/dx_pachong/reset.php',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'info': this.data.dx[0].user_number,
        'password': 'A' + this.data.dx[0].user_cid2
      },
      success: function (res) {
        console.log(res)
        if (res.data.reset) {
          if (res.data.reset == '重置成功') {
            that.changeSuccess()
          } else {
            that.handleErrorT()
            
          }
        }
      }
    })
  },
  //修改为默认密码 2M
  changemima_2m: function () {
    this.handleLoadingT()
    var that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/dx/dx_pachong/reset.php',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'info': this.data.dx1[0].user_number,
        'password': 'A' + this.data.stu_idcard1
      },
      success: function (res) {
        console.log(res)
        if (res.data.reset) {
          if (res.data.reset == '重置成功') {
            that.changeSuccess()
          } else {
            that.handleErrorT()
          }
        }
      }
    })
  },
  //手动报故障
  upfault:function(){
    wx.navigateTo({
      url: '../upfault/upfault?username=' + this.data.stu_name + '&&stu_number=' + this.data.stu_number + '&&stu_room=' + this.data.stu_room,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin()
    try {
      var user = wx.getStorageSync('user_name')
      if (user == '') {
        wx.switchTab({
          url: '../login/login'
        });
      } else {
        console.log(user)
        this.setData({
          user:user
        })
      }
    } catch (e) {
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
  onShareAppMessage: function () {

  }
})
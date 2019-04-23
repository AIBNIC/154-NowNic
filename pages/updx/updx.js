// pages/updx/updx.js
const isTel = (value) => !/^1[34578]\d{9}$/.test(value)
// const { $Toast } = require('../../dist/base/index');
import { $wuxToptips } from '../../dist1/index'
const app = getApp()
//获取token 通知模板
function sendMessage(e,that){
  // let that = this;
  let openid = that.data.openid;
  let token = that.data.token;
  let user = that.data.user;
  console.log(that.data)
  console.log(openid)
  wx.request({
    url: 'https://nic.fhyiii.cn/nic/xiaocx/sendMessage.php',
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      openid: openid,
      formid: e.detail.formId,
      access_token: token,
      state: that.data.state,
      student_name: user.name,
      student_id: user.num,
      student_room: user.room,
      student_error_s: user.error1,
      student_phone: user.telphone,
    },
    success: function (res) {
      console.log(res)
    },
    error: function (err) {
      console.log(err)
    }
  })
}


//通过学号查姓名和身份证 宿舍
function searchStu(e,that){
  that.showToptips3()
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/StudentInfo',
    method: 'POST',
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
   },
    data: { content: e , user: that.data.user_name},
    success: function (res) {
      console.log(res.data)
      that.setData({
        'user.name': res.data.stu_name,
        'user.idcard': res.data.stu_idcard,
        'user.room': res.data.stu_room
      })
      console.log(that.data)
    }
  })
  
}
//通过姓名查学号
function searchName(e,that){
  that.showToptips3()
  wx.request({
    url: 'https://nic.fhyiii.cn/wxcx/public/index/StudentInfo',
    method: 'POST',
    header: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" + wx.getStorageSync("SessionId")
    },
    data: { 
      content: e, 
      user: that.data.user_name
    },
    success: function (res) {
      console.log(res.data)
      that.setData({
        'user.num': res.data.stu_number,
        'user.idcard': res.data.stu_idcard,
        'user.room': res.data.stu_room
      })
      console.log(that.data)
    }
  })
}
Page({
  showToptips3() {
    $wuxToptips().info({
      hidden: false,
      text: '查询中，请稍等~',
      duration: 2800,
      success() { },
    })
  },
  
  /**
   * 页面的初始数据
   */
  data: {
    user:{
      name: '',
      num: '',
      room: '',
      error: '',
      error1: '',
      telphone: '',
      idcard: ''
    },
    state: '8M',
    token:''
  },
  //电信套餐
  onChange2(field, e) {
    this.setData({
      [field]: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onChange1(e) {
    this.onChange2('state', e)
  },
  //重置
  reset:function(){
    this.setData({
      'user.name':'',
      'user.num': '',
      'user.room': '',
      'user.error': '',
      'user.error1': '',
      'user.telphone': '',
      'user.idcard': ''
    })
  },
  //点击学号焦点查姓名
  onNum:function(){
    if (this.data.user['name'] != '' && this.data.user['num'] == ''){
      // searchName(this.data.user['name'],this)
    }
  },
  //提交按钮
  tijiao:function(e){
    wx.showLoading({
      title: '提交中',
    })
    let user = this.data.user;
    let that = this;
    console.log(this.data.openid)
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/updx/save.php',
      method:'POST',
      header: { "Content-Type":"application/x-www-form-urlencoded"},
      data:{
        student_name: user.name,
          student_id: user.num,
        student_room: user.room,
          student_state: that.data.state,
        student_error: user.error,
          student_error_s: user.error1,
        student_phone: user.telphone,
          student_cid: user.idcard
      },
      success:function(res){
        console.log(res)
        console.log(res.data.success)
        if(res.data.success){
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 500
          })
         
          //成功通知
          sendMessage(e, that);

          that.setData({
            user: ""
          })
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false, //显示确定按钮
            success: function (res) {
            }
          })
          
        }
      }

    })

    
  },

  name: function (e) {
    let that = this
    this.setData({
      'user.name': e.detail.value
    })
    // if (e.detail.value.length>= 2){
    // 
    // }
    // console.log(this.data.user)
  },

  stuNumber: function (e) {
    this.setData({
      'user.num': e.detail.value
    })
    let that = this
    if (e.detail.value.length == 11 ){
      // searchStu(e.detail.value,that)
    }
    console.log(this.data.user)
  },
  room: function (e) {
    this.setData({
      'user.room': e.detail.value
    })
    console.log(this.data.user)
  },
  error: function (e) {
    this.setData({
      'user.error': e.detail.value
    })
    console.log(this.data.user)
  },
  error1: function (e) {
    this.setData({
      'user.error1': e.detail.value
    })
    console.log(this.data.user)
  },
  
  idcard: function (e) {
    this.setData({
      'user.idcard': e.detail.value
    })
    console.log(this.data.user)
  },


  onChange(e) {
    console.log('onChange', e)
    this.setData({
      error: isTel(e.detail.value),
      value: e.detail.value,
      'user.telphone': e.detail.value
    })
    // console.log(this.data.user)
  },
  onFocus(e) {
    this.setData({
      error: isTel(e.detail.value),
    })
    console.log('onFocus', e)
  },
  onBlur(e) {
    this.setData({
      error: isTel(e.detail.value),
    })
    console.log('onBlur', e)
  },
  onConfirm(e) {
    console.log('onConfirm', e)
  },
  onClear(e) {
    console.log('onClear', e)
    this.setData({
      error: true,
      value: '',
    })
  },
  onError() {
    wx.showModal({
      title: '请输入 11 位手机号',
      showCancel: !1,
    })
  },
  onLoad: function (options) {
    app.checkLogin()
    wx.setNavigationBarTitle({
      title: '上报电信故障'
    })
    let that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/xiaocx/get_token.php',
      method: 'GET',
      success: function (res) {
        that.setData({
          token: res.data.access_token
        })
        console.log(res.data.access_token)
      },
      fail: function (err) {
        console.log(err)
      }
    })
    try {
      that.setData({
        openid: wx.getStorageSync('openid')
      })
      console.log(that.data.openid)
      var user = wx.getStorageSync('user_name')
      if (user == '') {
        wx.switchTab({
          url: '../login/login'
        });
      } else {
        console.log(user)
        this.setData({
          user_name: user
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
  // onShareAppMessage: function () {

  // }
})


var app = getApp()
// var util = require('../../utils/util')
Page({
  data: {
    staticData: {},
    currentInput: '',
    user_num:'',
    name:'',
    task: {
      uid: "",
      deadLine: "",
      time: "",
      title: "",
      description: "",
      tel: "",
      tagIndex: 0,
      placeIndex: 0
    }
  },
  onLaunch: function () {
    console.log('App Launch')
  },
  onLoad: function () {
    app.checkLogin()
    //设置静态数据
    this.setData({
      staticData: app.globalData.task
    })
    // 校验是否登录
    if (app.checkLogin()) {
      // 将缓存里的信息放在data数据里
      this.setData({
        user: app.getLocaStroage()
      })
    }
    var name = wx.getStorageSync('user_name')
    this.setData({
      name: name
    })
    console.log(name)
  },
  getInput: function (e) {
    this.setData({
      currentInput: e.detail.value
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  //紧急程度
  levelChange: function (e) {
    this.setData({
      "task.levelIndex": e.detail.value
    })
  },
  //姓名 学号
  bindInputTitle: function (e) {
    this.setData({
      "user_num": e.detail.value
    })
  },
  //描述
  bindInputDescription: function (e) {
    this.setData({
      "task.description": e.detail.value
    })
  },
 
  
  //故障地区
  placeChange: function (e) {
    this.setData({
      "task.placeIndex": e.detail.value
    })
  },
  submit: function (e) {
    var task = this.data.task;
    var that = this;
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/wx_fault1/fault.php',
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: "json",
      data: {
        'place': this.data.staticData.place[task.placeIndex],
        'user_num': this.data.user_num,
        'fault_ms': this.data.currentInput,
        'name':this.data.name
        // ':create_person': this.data.user.name,
      },
      success: function (res) {
        console.log(res)
        if (res.data=='success') {
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              that.setData({
                user_num: '',
                currentInput: '',
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })

  }
})
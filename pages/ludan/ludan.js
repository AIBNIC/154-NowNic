// pages/ludan/ludan.js
const app = getApp()
function getStuinfo(that,cid) {
  wx.showLoading({
    title: '查询信息中',
  })
  wx.request({
    // url: 'https://nic.fhyiii.cn/nic/2019kaiwang/searchstu.php',
    url: 'https://nic.fhyiii.cn/nic/searchStu/search.php',
    header: { "Content-Type":"application/x-www-form-urlencoded"},
    method: 'POST',
    data: {
      content: cid,
      user: that.data.jbr_input
    }, //
    success: function (res) {
      if (res.data==false){
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '查询不到',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.setData({
                stuinfo: '',
                room_input: ''
              })
            }
          }
        })
      }else{
        wx.hideLoading()
        that.setData({
          stuinfo: res.data,
          room_input: res.data.stu_room
        })
        // console.log(that.data.stuinfo)
      }
      
    }
  })
}

//获取 通知模板
function sendMessage(e, that) {
  // let that = this;
  console.log(that.data)
  let openid = that.data.openid;
  let token = that.data.token;
  let user = that.data.user;
  console.log(that.data)
  console.log(openid)
  wx.request({
    url: 'https://nic.fhyiii.cn/nic/xiaocx/sendMessage_kaiwang.php',
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      openid: openid,
      formid: e.detail.formId,
      access_token: token,
      student_name: that.data.stuinfo.stu_name, //姓名
      student_id: that.data.stuinfo.stu_number, //学号
      student_idcard: that.data.stuinfo.stu_idcard, //身份证
      student_state: that.data.state, //开网类型
      student_phone: that.data.newphone_input, //宽带账号
      student_jbr: that.data.jbr_input, //填写人
    },
    success: function (res) {
      console.log(res)
    },
    error: function (err) {
      console.log(err)
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // array: ['新开8M', '新开1M', '1M问题单', '8M问题单','其他办理'],
    objectArray: [
      {
        id: 0,
        name: '电信8M'
      },
      {
        id: 1,
        name: '电信2M'
      },
      {
        id: 2,
        name: '问题单请移步到上报电信'
      },
      // {
      //   id: 3,
      //   name: '8M问题单'
      // },
      // {
      //   id: 4,
      //   name: '其他办理'
      // }
    ],
    level: ["充了", "没充"],
    tip: ["没充", "充了"],
    tc_index: 0, //套餐
    dx_index: 0, //电信账号
    zx_index: 0, //赠送账号
    cid_input:null,
    state:null,
    stuinfo:[],
    state1:'充了',
    state2:'没充',

    stu_name:'',
    stu_idcard:'',
    stu_number:'',
    stu_major:'',
    telphone_input:'',
    newphone_input:'',
    sendphone_input:'',
    room_input:'',
    danhao_input: '',
    jbr_input: '',
    empty:''
  },
  //办理套餐
  bindPickerChange: function (e) {
    console.log(e.detail)
    console.log('办理套餐发送选择改变，携带值为', e.detail.value)
    this.setData({
      tc_index: e.detail.value
    })
    this.setData({
      state: this.data.objectArray[this.data.tc_index].name
    })
    console.log(this.data.state)
  },
  //电信账号 充值状态
  bindPickerChange1: function (e) {
    console.log(e.detail)
    console.log('电信账号发送选择改变，携带值为', e.detail.value)
    this.setData({
      dx_index: e.detail.value
    })
    this.setData({
      state1: this.data.level[this.data.dx_index]
    })
    console.log(this.data.state1)
  },
  //赠送账号 充值状态
  bindPickerChange2: function (e) {
    console.log(e.detail)
    console.log('赠送账号发送选择改变，携带值为', e.detail.value)
    this.setData({
      zx_index: e.detail.value
    })
    this.setData({
      state2: this.data.level[this.data.zx_index]
    })
    console.log(this.data.state2)
  },
  
  //获取身份证
  cid_input: function (e) {
    this.setData({
      cid_input: e.detail.value
    })
    if (e.detail.value.length==18){
      getStuinfo(this,this.data.cid_input)
    }
    if (e.detail.value.length == 0) {

    }

    // console.log(this.data.cid_input)
  },
  //获取联系电话
  telphone_input: function (e) {
    this.setData({
      telphone_input: e.detail.value
    })
    // console.log(this.data.telphone_input)
  },
  //获取宿舍号
  room_input: function (e) {
    this.setData({
      room_input: e.detail.value
    })
    // console.log(this.data.room_input)
  },
  //获取电信号码
  newphone_input: function (e) {
    this.setData({
      newphone_input: e.detail.value
    })
    // console.log(this.data.newphone_input)
  },
  //获取电信号码
  sendphone_input: function (e) {
    this.setData({
      sendphone_input: e.detail.value
    })
    // console.log(this.data.sendphone_input)
  },
  //获取意向单号
  danhao_input: function (e) {
    this.setData({
      danhao_input: e.detail.value
    })
    // console.log(this.data.danhao_input)
  },
  //获取经办人
  jbr_input: function (e) {
    this.setData({
      jbr_input: e.detail.value
    })
    // console.log(this.data.jbr_input)
  },
  // 
  tijiao:function(e){
    var value = wx.getStorageSync('userinfo')
    // console.log(value.user_name)
    wx.showLoading({
      title: '提交中',
    })

    var that = this

    if (that.data.room_input =='undefined'){
      wx.hideLoading()
      wx.showModal({
        title: '错误提示',
        content: '失败，请重试',
      })
    }
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/2019kaiwang/wx_tijiao.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        custName_txt: that.data.stuinfo.stu_name,
        certNo_fromIdCard_txt: that.data.stuinfo.stu_idcard,
        stu_id: that.data.stuinfo.stu_number,
        major: that.data.stuinfo.stu_major,
        telphone: that.data.telphone_input,
        int_num: that.data.newphone_input,
        int_num_state: that.data.state1,
        send_num: that.data.sendphone_input,
        send_num_state: that.data.state2,
        room_id: that.data.room_input,
        yixiang_num: that.data.danhao_input,
        jinban_man: that.data.jbr_input,
        handle: that.data.state,
        write_name: that.data.jbr_input
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.success){
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              sendMessage(e, that);
              that.setData({
                stuinfo: [],
                empty: '',
                newphone_input:'',
                sendphone_input:''
              })
              
            }
          })
          
        }else{
          // console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // wx.switchTab({
                //   url: '../mycenter/mycenter',
                // })
              }
            }
          })
        }
        console.log(res)
        
      },
      fail:function(fal){
        console.log(fal)
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin()
    wx.setNavigationBarTitle({
      title: '开网信息录入'
    })
    // console.log(this.data.index)
    this.setData({
      state: this.data.objectArray[this.data.tc_index].name
    })
    // console.log(this.data.state)
    var name = wx.getStorageSync('user_name')
    this.setData({
      jbr_input: name,
    })
    console.log(name)
    this.setData({
        openid: wx.getStorageSync('openid')
    })
    // console.log(this.data.stu_idcard)
    //获取token
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
    // this.onLoad()
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
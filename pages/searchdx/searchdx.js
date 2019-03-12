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
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/searchStu/searchdx.php',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        phone: this.data.cxnumber,
        user:this.data.user
      },
      success: function (res) {
        that.setData({ loading: false })
        console.log(res.data)
        if (res.data.resultCode != 0) {
          console.log("有问题")
        }
        that.setData({
          resultCode: res.data.resultCode,
          reason: res.data.reason,
          stuName: res.data.custName,
          totalBalance: res.data.totalBalance/100,
          rechargeNbr: res.data.rechargeNbr,
        })
       
       
      },
      fail: function (err) {
        console.log(err)
      }
    })
    wx.request({
      url: 'https://nic.fhyiii.cn/dx/dx_pachong/search.php',
      data:{
        info:this.data.cxnumber,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      //20175533426，20175533441 方宏毅 林泽文
      //20162204169
      success:function(res){
        if (!res.data.success){
          wx.showToast({
            title: '账号不存在',
            image: '../../images/icon-error.png'
          })
          this.setData({ stuName: '查无此人' })
          this.setData({ stuId: null })
          this.setData({ stuNumber: null })
          this.setData({ stuSpeed: null })
          this.setData({ stuState: null })
          return false;
        }
        console.log(res)
        var result = res.data.msg[0];
        // console.log(result)
        if (result.user_number!=""){
          this.setData({ stuName:result.user_name })
          this.setData({ stuId: result.user_id })
          this.setData({ stuNumber: result.user_number })
          this.setData({ stuSpeed: result.user_speed })
          this.setData({ stuState: result.user_state })
        }else{
          this.setData({ stuName: '查无此人' })
          this.setData({ stuId: '未知' })
          this.setData({ stuNumber: '未知' })
          this.setData({ stuSpeed: '速率未知' })
          this.setData({ stuState: '状态未知' })
          // this.setData({ loading: false })
        }
      }.bind(this),
      fail:function(err){
        console.log(err)
      }
    })

    wx.request({
      url: 'https://nic.fhyiii.cn/dx/dx_pachong/outUser.php',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        info: this.data.cxnumber,
        key:'search',
        user: this.data.user
      },
      success: function (res) {
        that.setData({ loading: false })
        console.log(res.data)
        if (res.data.success) {
          that.setData({
            dx_id: res.data.msg.info,
            dx_state: '在线', 
            dx_time: res.data.msg.start_time, 
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
  },

  //下线
  outUser:function(event){
    wx.showLoading({
      title: '下线中',
    })
    wx.request({
      url: 'https://nic.fhyiii.cn/dx/dx_pachong/outUser.php',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
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
    // wx.request({
    //   url: 'https://nic.fhyiii.cn/dx/dx_pachong/online.php',
    //   method: 'GET',
    //   success: function (res) {
    //     this.setData({ onLine: res.data.online })
    //     console.log(res.data.online)
    //   }.bind(this)
    // })
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
  onShareAppMessage: function () {
  
  },
  
})
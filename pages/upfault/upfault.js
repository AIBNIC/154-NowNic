// pages/upfault/upfault.js
// const isTel = (value) => !/^1[34578]\d{9}$/.test(value)
import { $wuxToast } from '../../dist1/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    stu_name: '',
    stu_number: '',
    stu_room: ''
  },
  showToast() {
    $wuxToast().show({
      type: 'success',
      duration: 1500,
      color: '#fff',
      text: '已完成',
      success: () => console.log('已完成')
    })
    
  },
  showToastErr() {
    $wuxToast().show({
      type: 'forbidden',
      duration: 1000,
      color: '#fff',
      text: '未查询禁止操作',
      success: () => wx.navigateBack({
        delta: 1
      })
    })
    
  },
  changeinfo:function(e){
    // console.log(e.detail.value)
    this.setData({
      info:e.detail.value
    })
  },
  tijiao:function(){
    wx.showLoading({
      title: '提交中',
    })
    var that = this 
    var name = wx.getStorageSync('user_name')
    wx.request({
      url: 'https://nic.fhyiii.cn/nic/wx_fault1/fault.php',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method:'POST',
      data:{
        user_num:that.data.stu_number,
        fault_ms:that.data.info,
        place:'学生区',
        name: name
      },
      success:function(res){
        console.log(res)
        if (res.data == 'success'){
          wx.hideLoading()
          that.showToast()
          that.setData({
            info: '',
            stu_name: '',
            stu_number: '',
            stu_room: ''
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.hideLoading()
          wx.showToast({
            title: res.data,
            image: '../../images/icon-error.png'
          })
        }
      },
      fail:function(){

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      stu_name: options.username,
      stu_number: options.stu_number,
      stu_room: options.stu_room
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
    if (this.data.stu_name==""){
      this.showToastErr()
      // wx.navigateBack({
      //   delta: 1
      // })
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
  // onShareAppMessage: function () {

  // }
})
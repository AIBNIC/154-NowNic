// pages/camera/camera.js
const app = getApp()
function upimage(res,user_name,that) {
  if (user_name==''){
    wx.showModal({
      title: '提示',
      content: '用户名不能为空',
      showCancel: false, //显示确定按钮
      success: function (res) {
      }
    })
  }else {
      wx.uploadFile({
        url: 'https://nic.fhyiii.cn/nic/updxIDCard/upapi.php', //仅为示例，非真实的接口地址
        //url: 'http://kf.fhyiii.cn/reid/upload_ID.php',
        //url: 'https://nic.fhyiii.cn/NIC/reid/upload_ID.php',
        header: {
          'content-type': 'multipart/form-data'
        },
        filePath: res,
        name: 'file',
        formData: {
          'new_name': user_name
        },
        success: function (res) {
          console.log(res)
          console.log(res.data)

          //字符串转数组
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
            var jj = JSON.parse(jsonStr);
            res.data = jj;
          }
          
          if (res.data.success) {
            let re = that.data.re;
            re.push(res.data.msg);
            that.setData({
              re: re
            })

            if (re.length == 2) {
              console.log(re)
              if (re[0] == re[1]) {
                console.log('成功')
                wx.hideLoading()
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 500
                })
                that.setData({
                  re: [],
                  imageurl: '',
                  imageurl1: '',
                  user_name: ''
                })
              }
            }

            // return res.data.re;
          }else{
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
  }
  
}
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    // tempFilePaths:'',
    imageurl:'',
    imageurl1: '',
    re:[],
    user_name:''
  },
  in_input:function(e){
    this.setData({
      user_name: e.detail.value
    })
  },
  chooseimage: function () {
    var _this = this;
    // var tempFilePaths = _this.data.tempFilePaths[0]['name'];
    // console.log(_this.data.tempFilePaths)
    wx.chooseImage({
      count: 1, // 默认9
      //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: 'compressed', 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      //sourceType: 'camera', 
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          // tempFilePaths: res.tempFilePaths[0],
          imageurl: res.tempFilePaths
        })
        console.log(_this.data.imageurl)
      }
    })
  },
  chooseimage1: function () {
    var _this = this;
    var tempFilePaths = _this.data.tempFilePaths;
    // console.log(tempFilePaths)
    wx.chooseImage({
      count: 1, // 默认9
      //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: 'original',
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      //sourceType: 'camera',
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          // tempFilePaths: tempFilePaths,
          imageurl1: res.tempFilePaths
        })
        console.log(_this.data.imageurl1)
      }
    })
  },
  upimage: function(){
      
      wx.showLoading({
        title: '上传中',
      })
      var _this = this;
      var user_name = _this.data.user_name;
      if (user_name == '') {
        wx.showModal({
          title: '提示',
          content: '用户名不能为空',
          showCancel: false, //显示确定按钮
          success: function (res) {
          }
        })
        wx.hideLoading();
      }
      var imageurl = _this.data.imageurl[0];
      var imageurl1 = _this.data.imageurl1[0];
      upimage(imageurl, user_name, _this) ; 
      upimage(imageurl1, user_name, _this); 

      // var re = _this.data.re;
      // if(re.length<2){
      //   wx.showModal({
      //     title: '提示',
      //     content: '上传失败',
      //     showCancel: false, //显示确定按钮
      //     success: function (res) {
      //     }
      //   })
      // }
      // for(var i = 0,len = re.length; i<len;  i++){
      //   console.log(re[i])
      // }
  },
  
  // getLocalImage: function () {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     success: function (res) {
  //       // 这里无论用户是从相册选择还是直接用相机拍摄，拍摄完成后的图片临时路径都会传递进来
  //       app.startOperating("保存中")
  //       var filePath = res.tempFilePaths[0];
  //       var session_key = wx.getStorageSync('session_key');
  //       // 这里顺道展示一下如何将上传上来的文件返回给后端，就是调用wx.uploadFile函数
  //       wx.uploadFile({
  //         url: app.globalData.url + '/home/upload/uploadFile/session_key/' + session_key,
  //         filePath: filePath,
  //         name: 'file',
  //         success: function (res) {
  //           app.stopOperating();
  //           // 下面的处理其实是跟我自己的业务逻辑有关
  //           var data = JSON.parse(res.data);
  //           if (parseInt(data.status) === 1) {
  //             app.showSuccess('文件保存成功');
  //           } else {
  //             app.showError("文件保存失败");
  //           }
  //         }
  //       })
  //     },
  //     fail: function (error) {
  //       console.error("调用本地相册文件时出错")
  //       console.warn(error)
  //     },
  //     complete: function () {

  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin()
    wx.setNavigationBarTitle({
      title: '电信证件上传'
    })
    // console.log(this.data.tempFilePaths)
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
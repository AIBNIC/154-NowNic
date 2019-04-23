// 引入SDK核心类
var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data:{
    markers: [{
      iconPath: '../../images/set.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: '#FF0000DD',
      width: 2,
      dottedLine: true
    }],
    controls: [{
        id: 1,
        iconPath: '../../images/set.png',
        position: {
          left: 0,
          top: 300 - 50,
          width: 50,
          height: 50
        },
        clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'MDNBZ-KIOCW-T6PRJ-OUNPH-VFQ6H-EKBEP'
    });
    this._getLocation();
  },
  //页面加载时定位到用户实际中心位置
  _getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    });
  },
  onShow: function () {
    // 调用接口
    // qqmapsdk.search({
    //   keyword: '酒店',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // });

    var _this = this;
    //调用获取城市列表接口
    // qqmapsdk.getCityList({
    //   success: function (res) {//成功后的回调
    //     console.log(res);
    //     console.log('省份数据：', res.result[0]); //打印省份数据
    //     console.log('城市数据：', res.result[1]); //打印城市数据
    //     console.log('区县数据：', res.result[2]); //打印区县数据
    //   },
    //   fail: function (error) {
    //     console.error(error);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // });
  }
})
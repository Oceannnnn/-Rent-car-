// pages/merchant/merchant.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    shop_img: [],
    shop_name:"",
    shop_address:"",
    shop_phone:"",
    shop_num:'',
    latitude:"",
    longitude:"",
    markerId:"",
    sLogin:0
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'loginStatus',
      success: function (res) {
        that.setData({
          sLogin: res.data
        })
      }
    })
    let markerId = options.markerId;
    var token = app.s_globalData.s_token;
    util.http('site/one', { id: markerId }, 'post', token).then(res => {
      if (res.code == 200) {
        var data = res.data;
        that.setData({
          shop_name: data.name,
          shop_address: data.address,
          shop_phone: data.phone,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          markerId: markerId,
          shop_num: data.car_num,
          shop_img: data.banner
        })
      }
    })
  },
  mapLocate(){
    var that = this;
    wx.openLocation({
      type: 'gcj02', 
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        name: that.data.shop_name,
        address: that.data.shop_address,
        scale: 28
    })
  },
  shopPhone() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.shop_phone
    })
  },
  useCar(){
    if (this.data.sLogin == 1) {
      if (this.data.shop_num > 0) {
        wx.navigateTo({
          url: '../useCar/useCar?markerId=' + this.data.markerId + '&carUse=' + this.data.shop_num,
        })
      } else {
        wx.showToast({
          title: '暂无车辆',
          icon: 'none',
          duration: 1000
        })
      }
    }else{
      wx.showToast({
        title: '请先登录！',
        icon: 'none',
        duration: 1000,
        success() {
          setTimeout(() => {
            wx.navigateTo({
              url: '../login/login'
            })
          },1000)
        }
      })
    }
  }
})
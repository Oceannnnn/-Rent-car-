// pages/repairPlace/repairPlace.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    rList: [],
    markers: [],
    itemHidden:true
  },
  onLoad: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: data => {
        if (data) {
          that.setData({
            latitude: data.latitude,
            longitude: data.longitude,
            scale: 16
          });
        }
        that.rList();
      }
    })
  },
  onReady() {
    this.mapCtx = wx.createMapContext('map');
  },
  r_phone(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  r_route: function (e) {
    wx.showLoading({
      title:"加载中"
    })
    var latitude = Number(e.currentTarget.dataset.latitude);
    var name = e.currentTarget.dataset.name;
    var longitude = Number(e.currentTarget.dataset.longitude);
    var address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18,
      name: name,
      address: address,
      success:function(){
        wx.hideLoading()
      }
    })
  },
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      iconPath: "../../public/image/tool2.png",
      id: point.id,
      latitude: latitude,
      longitude: longitude,
      label: {
        x: -10,
        y: -40,
        content: point.name,
        fontSize: 14,
        color:'#333333'
      },
      width: 20,
      height: 20
    };
    return marker;
  },
  rList(){
    wx.showLoading({
      title: '加载中'
    });
    var market = [];
    util.http('service/list', {}, 'get').then(res => {
      if (res.code == 200){
        if (res.data != '') {
          for (let item of res.data) {
            let marker1 = this.createMarker(item);
            market.push(marker1)
          } 
          this.setData({
            markers: market
          })
        } else {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 1000
          })
        }
        wx.hideLoading();
      }
    })
  },
  toLocation() {
    //调回缩放比，提升体验
    setTimeout(() => {
      this.setData({
        scale: 16
      })
    }, 1000)
    this.mapCtx.moveToLocation();
  },
  bindmarkert(e) {
    this.setData({
      itemHidden: false
    })
    var id = e.markerId;
    var token = app.s_globalData.s_token;
    util.http('service/getOne', { id: id }, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          address: res.data.address,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          phone: res.data.phone,
          name: res.data.name,
          start_time: res.data.start_time,
          end_time: res.data.end_time
        })
      }
    })
  },
  itemHidden() {
    this.setData({
      itemHidden: true
    })
  }
})
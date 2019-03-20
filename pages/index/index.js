//index.js
const util = require('../../utils/util.js');
const app = getApp();
var map = {
  data: {
    s_isLogin: 0,//0为未登录  1为登陆
    haveIdCard: 0,
    latitude: '31.325370',
    longitude: '120.410770',
    polyline: [],
    scale: 16,
    markers: [],
    listData: [],
    loginStatus: 0,
    actionSheetHidden: true,
    actionSheetItems: []
  },
  onLoad: function () {
    var _this = this; 
    util.http('site/list', {}, 'get').then(res => {
      if (res.code == 200) {
        _this.setData({
          listData: res.data
        })
        wx.getLocation({
          type: 'gcj02',
          success: data => {
            if (data) {
              _this.setData({
                latitude: data.latitude,
                longitude: data.longitude
              });
            }
            let markets = _this.getSchoolMarkers();
            _this.setData({
              markers: [],
              markers: markets
            })
          }
        })
      }
    })
    this.init();
  },
  init() {
    this.setData({
      msgList: [
        { title: "骑行前五分钟免费!" },
        { title: "最优的价格，最佳的车况，最好的用户" }]
    });
    // 1.先判断是否登陆，然后判断是否正在骑行，如果是转到骑行页面
    // 页面加载获取当前定位位置为地图的中心坐标
    if (wx.getStorageSync('loginStatus')) {
      this.setData({
        s_isLogin: wx.getStorageSync('loginStatus')
      })
    }
    if (wx.getStorageSync('haveIdCard')) {
      this.setData({
        haveIdCard: wx.getStorageSync('haveIdCard')
      })
    }
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        s_userInfo: wx.getStorageSync('userInfo')
      })
    }
  },
  toLocation() {
    //调回缩放比，提升体验
    setTimeout(() => {
      this.setData({
        scale: 16
      })
    }, 1000)
    wx.getLocation({
      type: 'gcj02',
      success: data => {
        if (data) {
          this.setData({
            latitude: data.latitude,
            longitude: data.longitude
          });
        }
      }
    })
  },
  getSchoolMarkers() { 
    var market = [];
    for (let item of this.data.listData) {
      let marker1 = this.createMarker(item);
      market.push(marker1)
    }
    return market;
  },
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      iconPath: "../../public/image/logo1.png",
      id: point.id,
      latitude: latitude,
      longitude: longitude,
      label: {
        x: 4,
        y: -46,
        content: point.site_name, 
        fontSize: 12,
        color: '#ffffff',
        bgColor: point.ten_color,
        padding: 4,
        borderRadius: 4,
        boxShadow: '4px 8px 16px 0 rgba(0)'
      },
      width: 40,
      height: 40
    };
    return marker;
  },
  bindmarkertap(e) {
    let markerId = e.markerId;
    wx.navigateTo({
      url: '../merchant/merchant?markerId=' + markerId,
    })
  },
  // 跳转到个人中心
  toUser() {
    var that = this;
    if (that.data.s_isLogin == 0) {
      wx.showModal({
        title: '提示',
        confirmText: '去登录',
        content: '为了使您获得更好的用户体验，请先登录！',
        success: function (res) {
          if (res.confirm) {
            if (app.s_globalData.s_userInfo) {
              wx.navigateTo({
                url: '../login/login'
              })
            } else {
              wx.navigateTo({
                url: '../toLogin/toLogin'
              })
            }
          }
        }
      })
    } else if (that.data.s_isLogin == 1) {
      wx.navigateTo({
        url: '../my/my',
      })
    }
  },
  // 扫码开锁
  toScan() {
    if (this.data.s_isLogin==0) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else if (this.data.s_isLogin == 1){
      if (app.s_globalData.s_haveIdCard == 1) {
        if (app.s_globalData.s_unOrder){
          wx.showToast({
            title: '存在未支付订单',
            icon: 'none',
            duration: 1000,
            success:function(){
              setTimeout(() => {
                wx.navigateTo({
                  url: '../orderRecord/orderRecord?currentTab=1',
                })
              },1000)
            }
          })
        } else {
          wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              var token = app.s_globalData.s_token;
              var car_id = res.result;
              util.http('order/new', { car_id: car_id }, 'post', token).then(res => {
                if (res.code == 200) {
                  var order = res.data;
                  wx.reLaunch({
                    url: '../unlock/unlock?order=' + order,
                  })
                } else {
                  wx.showToast({
                    title: '请重新扫码',
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            }
          })
        }
      } else if (app.s_globalData.s_haveIdCard == 0){
        wx.navigateTo({
          url: '../authentication/authentication',
        })
      }
    }
  },
  // 联系人工
  service: function () {
    wx.navigateTo({
      url: '../contact/contact',
    });
    this.actionSheetbindchange();
  },
  // 维修地点
  maintain: function () {
    wx.navigateTo({
      url: '../repairPlace/repairPlace',
    });
    this.actionSheetbindchange();
  },
  // 充电地点
  chargeUp: function () {
    wx.navigateTo({
      url: '../chargingPlace/chargingPlace',
    });
    this.actionSheetbindchange();
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      actionSheetItems: [
        { bindtap: 'chargeUp', txt: '充电地点', index: 1 },
        { bindtap: 'maintain', txt: '维修地点', index: 2 },
        { bindtap: 'service', txt: '联系客服', index: 3 }
      ]
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  onShareAppMessage: function (res) {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = "/" + currentPage.route;
    return {
      title: '风擎租车邀您绿色骑行！',
      path: url
    }
  }
}
Page(map)
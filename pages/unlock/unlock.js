// pages/unlock/unlock.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    loading: true,
    longitude: 0,
    latitude: 0,
    markers: [],
    scale: 16,
    status: '开锁中',
    hour:2,
    minute: 59,
    second: 58,
    cost: 6,
    order_id:''
  },
  onLoad: function (options) {
    var ridings = app.s_globalData.s_riding;
    if (ridings == 1){
      this.setData({
        loading:false,
        cost:6 * (this.data.hour+1)
      })
    }
    var token = app.s_globalData.s_token;
    util.http('order/count', {}, 'get', token).then(res => {
      var data = res.data;
      if (res.code == 200) {
        this.setData({
          hour: data.hour,
          minute: data.min,
          second: data.second,
          order_id: data.id,
          cost: data.totalMoney
        })
      }
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
          this.riding(res);
        }
      });
    })
  },
  // 重置骑行中的单车
  riding(res) {
    let longitude = res.longitude;
    let latitude = res.latitude;
    // 初始化骑行中的单车
    let markers = [{
      "id": 0,
      "iconPath": "../../public/image/logo1.png",
      "callout": {},
      "longitude": longitude,
      "latitude": latitude,
      "width": 50,
      "height": 50
    }]
    this.setData({
      scale: 18,
      longitude,
      latitude,
      markers
    })
    setTimeout(() => {
      let callout = "markers[" + 0 + "].callout";
      this.setData({
        loading: false,
        status: '解锁成功',
        [callout]: {
          "content": '骑行中',
          "color": "#ffffff",
          "fontSize": "16",
          "borderRadius": "50",
          "padding": "10",
          "bgColor": "#0082FCaa",
          "display": 'ALWAYS'
        }
      })
    }, 1500);
    this.Time();
  },
  Time() {
    let h = this.data.hour;
    let s = this.data.second - 1;
    let m = this.data.minute;
    // 计时开始
    this.timer = setInterval(() => {
      s++;
      this.setData({
        second: s
      })
      if (s >= 60) {
        s = 0;
        this.setData({
          second: s
        })
        m++;
        this.setData({
          minute: m
        });
        if (m == 5) {
          this.setData({
            cost: 6
          });
        }
        if (m >= 60) {
          m = 0;
          this.setData({
            minute: m
          });
          h++;
          this.setData({
            hour: h,
            cost: (h + 1) * 6
          });
        }
      };
    }, 1000)
  },
  toRepair() {
    wx.navigateTo({
      url: '/pages/repairPlace/repairPlace'
    })
  },
  // 还车
  toReturn() {
    wx.navigateTo({
      url: '/pages/toReturn/toReturn'
    })
  },
  // 计费
  charge() {
    wx.navigateTo({
      url: '/pages/charge/charge',
    })
  }
})
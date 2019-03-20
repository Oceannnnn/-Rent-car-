// pages/purse/purse.js
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    s_last_Dawn: app.s_globalData.s_last_Dawn,
    s_member:"普通会员",
    s_isMember:false,
    s_isWeekend:false,
    s_days:4,
    s_balance:3.00,
  },
  onLoad: function (options) {
    this.s_Weekend();
    this.setData({
      s_balance: app.s_globalData.s_balance
    })
  },
  s_goBuy(){
    wx.navigateTo({
      url: '../member/member',
    })
  },
  s_Weekend(){
    var s_data = new Date();
    if (s_data.getDay() == 6 || s_data.getDay() == 0){
      this.setData({
        s_isWeekend:true
      })
    }else{
      this.setData({
        s_isWeekend: false
      })
    }
  }
})
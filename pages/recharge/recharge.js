// pages/recharge/recharge.js
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    parameter: [],
    disabled: false
  },
  onLoad: function (options) {
    this.init();
  },
  s_parameterTap: function (e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameterList = this.data.parameter
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].id == this_checked) {
        parameterList[i].focus = 1;
      }
      else {
        parameterList[i].focus = 0;//其他的位置为false
      }
    }
    that.setData({
      parameter: parameterList
    })
  },
  s_goRecharge() {
    this.setData({
      disabled: true
    })
    var that = this;
    let id;
    let parameterList = that.data.parameter
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].focus == 1) {
        id = parseInt(parameterList[i].id);
      }
    }
    var token = app.s_globalData.s_token;
    util.http('recharge/add', {id:id}, 'post', token).then(res => {
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': res.signType,
        'paySign': res.paySign,
        'success': function (res) {
          that.setData({
            disabled: false
          })
          app.purse(token);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000,
            success:function(){
              setTimeout(() => {
                wx.navigateTo({
                  url: '../balance/balance',
                })
              },1000)
            }
          })
        },
        'fail': function (res) {
          that.setData({
            disabled: false
          })
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }) 
  },
  init(){
    var token = app.s_globalData.s_token;
    util.http('recharge/list', {}, 'get', token).then(res => {
      this.setData({
        parameter: res.data
      })
    })  
  }
})
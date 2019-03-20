// pages/pay/pay.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    coupon: 0,
    coupon_id:0,
    price: 1,
    order_id:'',
    s_balance: 0, //余额
    coupon_num:0,
    disabled: false,
    actionSheetHidden: true
  },
  onLoad: function (options) {
    let money = options.money;
    let order_id = options.order_id;
    this.setData({
      price: money,
      order_id: order_id,
      s_balance: Number(app.s_globalData.s_balance)
    })
    this.couponInit(money);
    var menu = 1;
    if (this.data.price > this.data.s_balance) {
      menu = 2;
    } else {
      menu = 1;
    } 
    this.setData({
      menu: menu
    })
  },
  couponInit(money){
    var token = app.s_globalData.s_token;
    util.http('pay/coupon', { money: money }, 'post', token).then(res => {
      if (res.code == 200){
        var listlen = res.data.data.length;
        this.setData({
          coupon_num: listlen
        })
      }else{
        this.setData({
          coupon_num: 0
        })
      }
    })
  },
  toPay() {
    this.setData({
      disabled:true
    })
    var token = app.s_globalData.s_token;
    var id = this.data.order_id;
    var coupon_id = this.data.coupon_id;
    var menu = this.data.menu;
    var that = this;
    var payment = this.data.price - this.data.coupon;
    if (menu == 2) { //微信支付
      if (payment > 0){
        util.http('pay/preorder', { id: id, coupon_id: coupon_id, }, 'post', token).then(res => {
          wx.requestPayment({
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.package,
            'signType': res.signType,
            'paySign': res.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000,
                success: function () {
                  that.setData({
                    disabled: false
                  })
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  }, 1000)
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
      }else{
        wx.showToast({
          title: '请用余额支付！',
          icon: 'none',
          duration: 1000
        })
      }
    }else{
      util.http('pay/balance', { id: id, coupon_id: coupon_id}, 'post', token).then(res => {
        if (res.code == 200 && res.data){
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              that.setData({
                disabled: false
              })
              app.purse(token)
              setTimeout(() => {
                wx.redirectTo({
                  url: '../index/index',
                })
              }, 1000)
            }
          })
        }
      })
    }
  },
  useCoupon() {
    wx.navigateTo({
      url: '../useCoupon/useCoupon?money=' + this.data.price
    })
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  }, 
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  }, 
  bindBalance: function () {
    if (this.data.price - this.data.coupon < this.data.s_balance) {
      this.setData({
        menu: 1,
        actionSheetHidden: !this.data.actionSheetHidden
      })
    }else{
      wx.showToast({
        title: '余额不足',
        icon: 'none',
        duration: 800
      })
    }
  },
  bindWechat: function () {
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  }
})

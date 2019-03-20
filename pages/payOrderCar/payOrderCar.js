// pages/payOrderCar/payOrderCar.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    price: 1,
    id: '',
    s_balance: 0, //余额
    payment: 0,
    disabled: false,
    actionSheetHidden: true
  },
  onLoad: function (options) {
    let money = options.money;
    let id = options.id;
    this.setData({
      price: money,
      id: id,
      s_balance: Number(app.s_globalData.s_balance)
    })
  },
  toPay() {
    this.setData({
      disabled: true
    })
    var token = app.s_globalData.s_token;
    var id = this.data.id;
    var balance = this.data.useBalance;
    var money = this.data.price;
    var menu = this.data.menu;
    var that = this;
    if (menu == 2) { //微信支付
      if (money > 0) {
        util.http('yuyue/preorder', { id: id }, 'post', token).then(res => {
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
                  }, 2000)
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
    } else {
      util.http('yuyue/balance', { id: id }, 'post', token).then(res => {
        if (res.code == 200 && res.data) {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000,
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
        } else {
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
    }
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
    if (this.data.price < this.data.s_balance) {
      this.setData({
        menu: 1,
        actionSheetHidden: !this.data.actionSheetHidden
      })
    } else {
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

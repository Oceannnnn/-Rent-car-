// pages/balance/balance.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    s_money:"0.00"
  },
  onLoad: function (options) {
    this.setData({
      s_money: app.s_globalData.s_balance
    })
  },
})
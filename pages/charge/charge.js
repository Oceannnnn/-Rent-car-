// pages/charge/charge.js
const util = require('../../utils/util.js');
Page({
  data: {
    money:6,
  },
  onLoad: function (options) {},
  rule() {
    wx.navigateTo({
      url: '../quotationRules/quotationRules',
    })
  }
})
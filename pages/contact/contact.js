// pages/contact/contact.js
const app = getApp()
Page({
  data: {
    name: '',
    phone: '',
    address: '',
  },
  onLoad: function (options) {
    this.setData({
      name: app.s_globalData.s_officeName,
      phone: app.s_globalData.s_officePhone,
      address: app.s_globalData.s_officeAddress,
    })
  },
  s_calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  }
})
// pages/toLogin/toLogin.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  cancel(){
    wx.navigateBack()
  },
  getUserInfo(e) {
    let token = app.s_globalData.s_token;
    wx.login({
      success: function (msg) {
        var code = msg.code;
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: msg => {
                    var encryptedData = msg.encryptedData;
                    var iv = msg.iv;
                    util.http('userinfo/login', { code: code, encryptedData: encryptedData, iv: iv }, 'post', token).then(data => {
                      app.s_globalData.s_userInfo = e.detail.userInfo; 
                      wx.setStorage({
                        key: "userInfo",
                        data: e.detail.userInfo
                      })
                      wx.navigateTo({
                        url: '../login/login',
                      })
                    })
                  }
                })
              }
            }
        })
      }
    })
  }
})
// pages/my/my.js
/**
* @author s
* @data 2018-06-25
*/
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    s_isUser:true,
    s_userInfo: {},
    s_hasUserInfo: false,
    IdCard: 0,
    s_canIUse: wx.canIUse('button.open-type.getUserInfo'),
    s_member: '',
    s_last_Dawn: '',
    integral:0
  },
  onLoad: function () {
    this.landing();
    this.integral();
  },
  landing() {
    if (app.s_globalData.s_userInfo) {
      this.setData({
        s_userInfo: app.s_globalData.s_userInfo,
        s_hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          s_userInfo: res.userInfo,
          s_hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.s_globalData.s_userInfo = res.userInfo;
          this.setData({
            s_userInfo: res.userInfo,
            s_hasUserInfo: true
          })
        }
      })
    }
  },
  IdCard(){
    wx.navigateTo({
      url: '../authentication/authentication'
    })
  },
  integral(){
    this.setData({
      s_last_Dawn: app.s_globalData.s_last_Dawn,
      IdCard: app.s_globalData.s_haveIdCard,
    })
    var token = app.s_globalData.s_token;
    util.http('my/integral', {}, 'get', token).then(res => {
      if (res.code == 200){
        if (res.data != null) {
            this.setData({
              integral: Number(res.data)
            })
          }
        }
    })
  }
})
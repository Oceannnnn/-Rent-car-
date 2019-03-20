//app.js
const util = require('utils/util.js');
App({
  onLaunch: function () {
    wx.showLoading({
      title:'加载中'
    })
    // 登录
    wx.login({
      success: res => {
        util.http('token/user', { code: res.code }, 'post').then(msg => {
          var token = this.s_globalData.s_token = msg.token;
          wx.setStorage({
            key: "token",
            data: msg.token
          })
          let that = this;
          wx.request({
            url: util.url + "my/check", 
            header: {
              'content-type': 'application/json',
              token: token
            },
            method:'GET',
            success: function (res) {
              wx.hideLoading();
              let data = res.data;
              that.s_globalData.s_isFengUser = data.login;
              that.s_globalData.s_haveIdCard = data.checkCard;
              that.s_globalData.s_riding = data.riding;
              that.s_globalData.s_unOrder = data.unOrder;
              var riding = that.s_globalData.s_riding;
              if (riding === 1) {
                wx.redirectTo({
                  url: '../unlock/unlock',
                })
              }
              that.getAbout(token); 
              that.purse(token);
            }
          })
        })
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.s_globalData.s_userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  s_globalData: {
    s_userInfo: null,
    // s_loginState: 0,//0为未登录  1为登陆
    s_last_Dawn: "/public/image/last_Dawn.png",
    s_isFengUser: 0,//0为非风擎用户  1为风擎用户
    s_haveIdCard: 0, //0为无验证  1为认证
    s_riding: 0,//1骑行中   0不再骑行中
    s_unOrder:false, //true有未完成订单，false为没有未完成订单
    s_officePhone:'',//公司电话
    s_officeAddress: '',//公司地址
    s_officeName: '',//公司地址
    s_token:'',
    s_balance:''//余额
  },
  getAbout(token){
    util.http('about/index ', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.s_globalData.s_officePhone = res.data.phone;
        this.s_globalData.s_officeName = res.data.name;
        this.s_globalData.s_officeAddress = res.data.address;
      }
    })
  },
  purse(token){
    util.http('my/money', {}, 'get', token).then(res => {
      this.s_globalData.s_balance = res.data
    })
  }
})
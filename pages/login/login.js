// pages/login/login.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    show: false,
    phoneText: '',
    smsText: '',
    time: 60,
    showTime: false,
    btnText: "获取验证码",
    sms_disable: 'disable',
    btn_disable: 'disable',
    toNext: '',
    loginText:'下一步',
    handleClick: 'handleClick'
  },
  onLoad: function (options) {},
  // 手机号输入
  input(e) {
    let value =  util.checkMobile(e.detail.value);
    this.setData({
      phoneText: value
    })
    if (this.data.phoneText.length == 13) {
      this.setData({
        sms_disable: '',
        show: true,
        loginText: "登陆"
      })
      if (this.data.smsText.length == 4) {
        this.setData({
          btn_disable: ''
        })
      }
    } else {
      this.setData({
        sms_disable: 'disable',
        toNext: '',
        btn_disable: 'disable',
        show: false,
        loginText: "下一步"
      })
    }
  },
  //验证码输入
  smsinput(e) {
    let value = e.detail.value;
    value = value.replace(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]\-\sa-zA-Z]*/g, "");
    this.setData({
      smsText: value
    })
    if (value.length == 6 && this.data.phoneText.length == 13) {
      this.setData({
        btn_disable: '',
        toNext: 'toNext'
      })
    } else {
      this.setData({
        btn_disable: 'disable',
        toNext: ''
      })
    }
  },
  //清空输入框内容
  cleanInput() {
    this.setData({
      smsText: '',
      phoneText: '',
      sms_disable: 'disable',
      btn_disable: 'disable',
      toNext: '',
      show: false,
      loginText: "下一步"
    })
  }, 
  // 发送验证码
  handleClick() {
    let phoneNumber = this.data.phoneText.replace(/\s+/g, "");
    if (!util.toCheck(phoneNumber)) {
      this.checkLogin()
    } else {
      this.setData({
        sms_disable: 'disable',
        handleClick: '',
        showTime: true,
        btnText: '秒后重发'
      })
      // 验证码倒计时
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          let time = this.data.time;
          time--;
          this.setData({
            time,
            handleClick: '',
            sms_disable: 'disable'
          })
          if (time == 0) {
            this.setData({
              time: 60,
              showTime: false,
              btnText: '重新获取',
              sms_disable: '',
              handleClick: 'handleClick'
            })
          }
        }, i * 1000)
      };
      // var url = "login/code"
      util.http('login/sms', { phone: phoneNumber}, 'post').then(res => {
        wx.showToast({
          title: '已发送',
          icon: 'none',
          duration: 3000 //1000
        })
      })
    }
  },
  // 下一步按钮
  toNext() {
    let code = Number(this.data.smsText);
    let phoneNumber = this.data.phoneText.replace(/\s+/g, "");
    if (!util.toCheck(phoneNumber)) {
      this.checkLogin()
    } else if (code == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
    } else {
      // 请求后台注册登陆
      let token = app.s_globalData.s_token;
      util.http('login/index', { phone: phoneNumber, code: code }, 'post', token).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1000 
          })
          wx.setStorage({
            key: "loginStatus",
            data: 1
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/index/index'
            })
          },1000)
        } else {
          this.setData({
            smsText: ''
          })
          wx.showToast({
            title: res.err_msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },
  checkLogin(){
    wx.showToast({
      title: '手机号码不正确',
      image: '../../public/image/warning.png',
      success: () => {
        this.setData({
          phoneText: '',
          show: false,
          smsText: '',
          toNext: '',
          btn_disable: 'disable'
        })
      }
    })
  },
  is_FengUser(e) {
    if (app.s_globalData.s_isFengUser == 1) {
      wx.setStorage({
        key: "loginStatus",
        data: 1
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '../index/index'
        })
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
      }, 500)
    } else {
      wx.showModal({
        title: '提示',
        content: '没有账户，请注册！'
      })
    }
  } 
})
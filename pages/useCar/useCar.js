// pages/useCar/useCar.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    date: '',
    time: '',
    s_Data:'',
    s_Time:'',
    markerId:''
  },
  onLoad: function (options){
    let markerId = options.markerId; 
    let carUse = options.carUse;
    this.setData({
      markerId: markerId,
      carUse: carUse
    })
    this.resetData()
  },
  formSubmit: function (e) {
    var value = e.detail.value;
    let token = app.s_globalData.s_token;
    var phone = value.phone;
    var name = value.name;
    var car_num = value.car_num;
    var use_time = value.use_time;
    var use_date = value.use_date;
    var use_data = "use_data";
    var id = "id";
    value[use_data] = use_date + ' ' + use_time;
    value[id] = this.data.markerId;
    delete value.use_time;//删除属性
    delete value.use_date;//删除属性
    if (name=='') {
      this.check('请填写姓名！');
    } else if (!util.toCheck(phone)) {
      this.check('手机号码不正确！');
    } else if (car_num==''){
      this.check('请填写车辆数！');
    } else if (use_data==''){
      this.check('请选择日期！');
    } else if (use_time==''){
      this.check('请选择时间！');
    } else {
      var money = 0.01 * car_num;
      util.http('yuyue/index', value, 'post', token).then(res => {
        if (res.code == 200) {
          if(res.data){
            var yuyue_id = res.data.id;
            wx.navigateTo({
              url: '../payOrderCar/payOrderCar?money=' + money + '&id=' + yuyue_id,
            })
          } else {
            wx.showToast({
              title: res.err_msg,
              icon: 'none',
              duration: 1000
            })
            this.setData({
              time: '',
              date: ''
            })
          }
        }else{
          wx.showToast({
            title: '预约失败！',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
    
  }, 
  check(n){
    wx.showToast({
      title: n,
      icon: 'none',
      duration: 1000
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  resetData() {
    var that = this;
    var myDate = new Date();
    var data = util.formatTime(myDate).s_Data;
    var time = util.formatTime(myDate).s_Time;
    that.setData({
      s_Data: data,
      s_Time: time,
    })
  },
  carNum(e){
    var value = e.detail.value;
    if (value > this.data.carUse) {
      wx.showToast({
        title: '可用车辆只有' + this.data.carUse,
        icon: 'none',
        duration: 1000
      })
      this.setData({
        carNum: ''
      })
    }
  }
})
// pages/toReturn/toReturn.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    var token = app.s_globalData.s_token;
    util.http('order/count', {}, 'get', token).then(res => {
      var data = res.data;
      if (res.code == 200) {
        this.setData({
          order_id: data.id,
          money: data.totalMoney
        })
      }
    })
  },
  toReturn() {
    let order_id = this.data.order_id;
    let money = this.data.money;
    let token = app.s_globalData.s_token;
    util.http('order/ret', { id: order_id, money: money }, 'post', token).then(res => {
      if (res.code == 10000) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1000
        })
        // setTimeout(() => {
        //   wx.showLoading({
        //     title: '等待商家确认！'
        //   })
        // }, 1500)
        // setInterval(()=>{
        //   this.reset()
        // },200);
        setTimeout(() => {
          wx.navigateTo({
            url: '../pay/pay?money=' + money + '&order_id=' + order_id,
          })
        }, 1500)
      }
    })
  }
})
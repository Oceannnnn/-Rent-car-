// pages/orderCard/orderCard.js
const util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    pageNumber: 1,
    onBottom: true,
    s_orderCarList:[]
  },
  onLoad: function (options) {
    this.s_orderCarList(this.data.pageNumber);
  },
  orderCancel(e){
    var id = e.currentTarget.dataset.id;
    var token = app.s_globalData.s_token;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消预约吗？',
      success: function (res) {
        if (res.confirm) {
          util.http('yuyue/cancel', { id: id }, 'post', token).then(res => {
            if (res.code == 200) {
              app.purse(token)
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 1000,
                success: function () {
                  wx.navigateTo({
                    url: '../orderCard/orderCard',
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  onReachBottom: function () {
    var that = this;
    // 当前页+1
    var pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.s_orderCarList(this.data.pageNumber);
    }
  },
  s_orderCarList(page) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.s_orderCarList;
    var token = app.s_globalData.s_token;
    util.http('yuyue/list', { page: page }, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            s_orderCarList: list
          })
        } else {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 1000
          })
          this.data.onBottom = false;
        }
        wx.hideLoading();
      }
    })
  },
  orderPay(e) {
    var id = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '../payOrderCar/payOrderCar?id=' + id + '&money=' + money
    })
  }
})
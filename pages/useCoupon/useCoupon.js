// pages/useCoupon/useCoupon.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    coupon_item:[],
    onBottom:true,
    pageNumber:1,
    money:''
  },
  onLoad: function (options) {
    var money = options.money;
    this.setData({
      money: money
    })
    this.couponList(this.data.pageNumber, money)
  },
  UnChooseCoupon(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var coupon = e.currentTarget.dataset.coupon;
    var id = e.currentTarget.dataset.id;
    prevPage.setData({
      coupon: 0,
      coupon_id: 0,
    })
    wx.navigateBack();
  },
  chooseCoupon(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var coupon = e.currentTarget.dataset.coupon;
    var id = e.currentTarget.dataset.id;
    prevPage.setData({
      coupon: coupon,
      coupon_id:id
    })
    wx.navigateBack();
  },
  onReachBottom: function () {
    var that = this;
    // 当前页+1
    var pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.couponList(this.data.pageNumber, this.data.money)
    }
  },
  couponList(page_number, money) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.coupon_item;
    var token = app.s_globalData.s_token;
    util.http('pay/coupon', { money: money, page: page_number }, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            coupon_item: list
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
  }
})
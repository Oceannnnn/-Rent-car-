// pages/orderRecord/orderRecord.js
/**
* @author s
* @data 2018-06-26
*/
const util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    isShow: true,
    currentTab: 0,
    s_qixing:"777.3",
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    s_orderList: [],
    s_unOrderList:{},
    onBottom:true
  },
  onLoad: function (options) {
    var token = app.s_globalData.s_token;
    if (options.currentTab) {
      this.setData({
        currentTab: parseFloat(options.currentTab),
        isShow: false
      })
    }
    this.un(token);
    this.com(token, this.data.pageNumber);

  },
  onReachBottom: function () {
    var that = this;
    var pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      if (this.data.currentTa == 0) {
        this.com(app.s_globalData.s_token, this.data.pageNumber);
      }
    }
  },
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 0;
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },
  pay(e){
    let order_id = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '../pay/pay?money=' + money + '&order_id=' + order_id
    })
  },
  un(token) {
    wx.showLoading({
      title: '加载中'
    });
    util.http('order/un', {}, 'get', token).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        var data = res.data;
        this.setData({
          s_unOrderList: data.data
        })
      } else {
        this.setData({
          s_unOrderList: ''
        })
      }
    })
  },
  com(token, page) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.s_orderList;
    util.http('order/com', { page: page}, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data == '') {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            orderListData: 0
          })
          this.data.onBottom = false;
        } else {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            s_orderList: list,
            orderListData: 1
          })
        }
        wx.hideLoading();
      }
    })

  }
})
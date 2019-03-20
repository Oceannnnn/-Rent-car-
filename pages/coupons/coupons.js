const util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    isShow: true,
    currentTab: 0,
    s_haveQi: [],
    pageNumber: 1,
    onBottom: true,
  },
  onLoad: function () {
    this.s_haveQi(this.data.pageNumber)
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
  onReachBottom: function () {
    var that = this;
    // 当前页+1
    var pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.s_haveQi(this.data.pageNumber);
    }
  },
  s_haveQi(page) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.s_haveQi;
    let token = app.s_globalData.s_token;
    util.http('my/coupon', { page: page }, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data == '') {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 1000
          })
          this.data.onBottom = false;
        }else{
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            s_haveQi: list
          })
        }
        wx.hideLoading();
      }
    })

  }
})
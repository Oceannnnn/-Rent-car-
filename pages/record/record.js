// pages/record/record.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    recordList: [],
    pageNumber: 1,
    onBottom: true,
  },
  onLoad: function (options) {
    this.recordList(1)
  },
  onReachBottom: function () {
    var that = this;
    // 当前页+1
    var pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recordList(this.data.pageNumber);
    }
  },
  recordList(page) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.recordList;
    var token = app.s_globalData.s_token;
    util.http('recharge/userList', { page: page }, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data == '') {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 1000
          })
          this.data.onBottom = false;
        } else {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            recordList: list
          })
        }
        wx.hideLoading();
      }
    })

  }
})
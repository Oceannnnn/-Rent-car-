
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var obj = {
    s_Data: [year, month, day].map(formatNumber).join('-'),
    s_Time: [hour, minute].map(formatNumber).join(':')
  }
  return obj
}
const u = "https://zuche.fqwlkj.cn/api/v1/"
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//request请求
const http = (url, data = {}, method = 'get',token = '') => {
  const Url = u + url;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: Url,
      data: data,
      method: method ? method : 'get',
      header: { 
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
}
//手机号码
const checkMobile = (str) => {
  let value = str;
  value = value.replace(/[\u4E00-\u9FA5`~!@#$%^&*()_+<>?:"{},.\/;'[\]\-\sa-zA-Z]*/g, "");
  let result = [];
  for (let i = 0; i < value.length; i++) {
    if (i == 3 || i == 7) {
      result.push(" ", value.charAt(i));
    }
    else {
      result.push(value.charAt(i));
    }
  }
  return result.join("")
}
// 正则校验手机号
const toCheck = (str) => {
  var isMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  return isMobile.test(str);
}
module.exports = {
  formatTime: formatTime,
  http: http,
  checkMobile: checkMobile,
  toCheck: toCheck,
  url:u
}

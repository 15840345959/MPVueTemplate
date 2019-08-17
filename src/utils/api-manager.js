import Fly from 'flyio/dist/npm/wx'
import { judgeIsAnyNullStr } from './api-common'
const fly = new Fly()
const DEDUG = 3
let host = ""
switch (DEDUG) {
  case 1: host = 'https://ylc.isart.me/api/'; break;            //正式环境
  case 2: host = 'http://defky.isart.me/api/'; break;           //测试环境
  case 3: host = 'http://localhost/fkySrv/public/api'; break;   //本地环境
}

// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // console.log("-----");

  wx.showLoading({
    title: '加载中',
    mask: true
  })
  var userInfo = wx.getStorageSync("userInfo");

  if (!judgeIsAnyNullStr(userInfo)) {
    if (judgeIsAnyNullStr(request.body.user_id)) {
      request.body.user_id = userInfo.id
    }
    if (judgeIsAnyNullStr(request.body.token)) {
      request.body.token = userInfo.token
    }
  }
  console.log(JSON.stringify(request))
  request.headers = {
    'X-Tag': 'flyio',
    'content-type': 'application/json'
  }
  return request
})
// 添加响应拦截器
fly.interceptors.response.use(
  async (response) => {
    wx.hideLoading()

    //用户信息错误
    if (response.data.code == 101 || response.data.code == 102 || response.data.code == 103) {
      showToast('用户信息错误');
      await auth_login()
      console.log("重新登录成功")
      return false
    }

    // console.log("----", JSON.stringify(response))
    return response.data.ret // 请求成功之后将返回值返回
  },
  (err) => {
    // 请求出错，根据返回状态码判断出错原因
    console.log(JSON.stringify(err))
    wx.hideLoading()
    if (err) {
      return '请求失败'
    };
  }
)
fly.config.baseURL = host


//封装接口调用
//@param
// that:页面实例，即页面的vm=this,应传入页面实例
// url:相对的url地址，因为在flyio中已经设置了baseUrl
// method:get or post
// callback：成功的回调函数
// loadding_flag:是否有加载提示
// loadding_text:加载提示的文字
export function http_flyio(url, method = "get", param, callback, loadding_flag = true, loadding_text = "加载中...") {
  if (loadding_flag) {
    //加载提示
    wx.showLoading({
      title: loadding_text,
      mask: true
    });
  }
  fly.request({
    method: method, //post/get 请求方式
    url: url,
    body: param
  })
    .then(res => callback(res));
}

export default fly

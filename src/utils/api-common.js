export function showModal(title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}
export function showSuccess(text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}
//展示空toast
export function showToast(title) {
  wx.showToast({
    title,
    icon: 'none',
    duration: 1500,
  })
}
// 校验手机号
export function checkPhone(phone) {
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    return false;
  } else {
    return true
  }
}
//判断是否有空字符串
export function judgeIsAnyNullStr() {
  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null || arguments[i] == "" || arguments[i] == undefined || arguments[i] == "undefined" || arguments[i] == "未设置") {
        return true;
      }
    }
  }
  return false;
}
//  base64编码
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export function base64encode(str) {
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(
        ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
      );
      out += base64EncodeChars.charAt((c2 & 0xf) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3f);
  }
  return out;
}
//数字转换  例如1123456转换为112.3w
export function numSwitch(num) {
  var num = num.toString()
  var length = num.toString().length
  if (length == 4) {
    var one = num.toString().substr(0, 1)
    var two = num.toString().substr(1, 2)
    return one + "." + two + "k"
  } else if (length == 5) {
    var one = num.toString().substr(0, 1)
    var two = num.toString().substr(1, 2)
    return one + "." + two + "w"
  } else if (length == 6) {
    var one = num.toString().substr(0, 2)
    var two = num.toString().substr(2, 1)
    return one + "." + two + "w"
  } else if (length == 7) {
    var one = num.toString().substr(0, 3)
    var two = num.toString().substr(3, 1)
    return one + "." + two + "w"
  } else {
    return num
  }
}
function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
//格式化日期时间
export function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  // return [year, month, day].map(formatNumber).join('-')
  return [month, day].map(formatNumber).join('-')
}
export default {
  numSwitch,
  formatTime,
  base64encode,
}

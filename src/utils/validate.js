/**
 * 过滤特殊字符串
 * @param {*} s 需要被过滤的字符串 
 */
export function stripscript(s) {
  var pattern = new RegExp("[`~!#$%^&*()=|{}':;',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；： ”“'。，、？↵\r\n]");
      var rs = "";
  for (var i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}
/**
 * 验证邮箱地址是否合法
 * @param {*} value 邮箱字符串
 */
export function validateEmail(value){
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return reg.test(value)
}
/**
 * 验证密码
 * @param {*} value 邮箱字符串
 */
export function validatePassword(value){
  let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
  return reg.test(value)
}
/**
 * 验证验证码
 * @param {*} value 验证码 
 */
export function validateCode(value){
  let reg = /^[0-9a-z]{6}$/;
  return reg.test(value)
}
/**
 * 验证手机号
 * @param {*} value 手机号
 */
export function validatePhone(value){
  let reg = /^1[34578]\d{9}$/;
  return reg.test(value)
}
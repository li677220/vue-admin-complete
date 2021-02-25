import service from "@/utils/request"
/**
 * 登录
 */
export function Login(data){
  return service.request({
    method: "POST",
    url: "/login/",
    data
  })
}
/**
 * 注册
 */
export function Register(data){
  return service.request({
    method: "POST",
    url: "/register/",
    data
  })
}
/**
 * 获取验证码
 */
export function GetSms(data){
  return service.request({
    method: "POST",
    url: "/getSms/",
    data
  })
}
/**
 * 获取用户角色
 */

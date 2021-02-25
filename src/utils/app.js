import cookie from "js-cookie"
export function getToken(value){
  return cookie.get(value)
}
export function setToken(value){
  cookie.set("admin-token",value)
}
export function removeToken(){
  cookie.remove("admin-token")
  cookie.remove("username")
}
export function setUserName(value){
  cookie.set("username",value)
}
export function getUserName(value){
  return cookie.get(value)
}
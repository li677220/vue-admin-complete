import service from "@/utils/request"
/**
 * 获取用户列表
 */
export function GetUserList(data){
  return service.request({
    method: "POST",
    url: "/user/getList/",
    data
  })
}
/**
 * 添加用户
 */
export function AddUser(data){
  return service.request({
    method: "POST",
    url: "/user/add/",
    data
  })
}
/**
 * 编辑用户
 */
export function EditUser(data){
  return service.request({
    method: "POST",
    url: "/user/edit/",
    data
  })
}
/**
 * 删除用户
 */
export function DeleteUser(data){
  return service.request({
    method: "POST",
    url: "/user/delete/",
    data
  })
}
/**
 * 禁用启用用户
 */
export function DisableUser(data){
  return service.request({
    method: "POST",
    url: "/user/actives/",
    data
  })
}
/**
 * 获取角色
 */
export function GetRole(){
  return service.request({
    method: "POST",
    url: "/role/",
    data: {}
  })
}
/**
 * 获取系统
 */
export function GetSystem(){
  return service.request({
    method: "POST",
    url: "/system/",
    data: {}
  })
}
/**
 * 获取用户角色
 */
export function GetUserRole(){
  return service.request({
    method: "POST",
    url: "/userRole/",
    data: {}
  })
}
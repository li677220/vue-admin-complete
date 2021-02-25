import router from "./index";
import store from '@/store/index.js'
import { getToken } from "@/utils/app"

router.beforeEach((to, from, next) => {
  // 防止路由跳转的死循环 多加一层判断
  if(getToken("admin-token")){
    if(to.path == "/login"){
      next()
    }else{
      // next("/login")
      // 获取用户角色，动态分配权限
      if(store.getters['permission/roles'].length == 0){
        store.dispatch('permission/getRoles').then(res => {
          let role = res
          store.dispatch('permission/createRouter',role).then(res => {
            // console.log(res);
            let addRouters = store.getters['permission/addRoutes']
            // 添加动态路由
            router.addRoutes(addRouters)
            next({...to, replace: true})//replace,导航不会留下history
          })
        })
      }else{
        next()
      }
    }
  }else{
    if(to.path == "/login"){
      next()
    }else{
      next("/login")
    }
  }
})


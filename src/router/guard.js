  
import router from "./index";
import { getToken } from "@/utils/app"

router.beforeEach((to, from, next) => {
  // 防止路由跳转的死循环 多加一层判断
  if(getToken("admin-token")){
    next()
  }else{
    if(to.path == "/login"){
      next()
    }else{
      next("/login")
    }
  }
})
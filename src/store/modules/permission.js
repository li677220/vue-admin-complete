import { GetUserRole } from "@/api/user.js"
import { defaultRoutes, asyncRoutes } from "@/router/index2.js"
const state = {
  roles: [],
  allRoutes: defaultRoutes,
  addRoutes: []
}
const getters = {
  roles: state => state.roles,
  rolallRouteses: state => state.allRoutes,//全部
  addRoutes: state => state.addRoutes//匹配
}
const mutations = {
  setRoles(state,val){
    state.roles = val
  },
  setRouter(state,router){
    state.addRoutes = router
    state.allRoutes = defaultRoutes.concat(router)
  }
}
const actions = {
  // 获取用户角色
  getRoles(context, requestData) {
    return new Promise((res, rej) => {
      GetUserRole(requestData).then((response) => {
        let role = response.data.data.role
        context.commit('setRoles',role)
        res(role)
      }).catch((err) => {
        rej(err)
      })
    })
  },
  // 创建动态路由
  createRouter(context, requestData){
    return new Promise((res, rej) => {
      let role = requestData
      const addRouters = asyncRoutes.filter(item => role.includes(item.meta.system))
      context.commit('setRouter',addRouters)
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
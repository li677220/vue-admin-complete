import { Login } from "@/api/login"
const actions = {
  login(context, requestData) {
    return new Promise((res, rej) => {
      Login(requestData).then((response) => {
        console.log(context);
        let data = response.data.data
        context.commit("user/setToken",data.token,{root: true})
        context.commit("user/setUserName",data.username,{root: true})
        res(response)
      }).catch((err) => {
        rej(err)
      })
    })
  }
}
export default {
  namespaced: true,
  actions
}
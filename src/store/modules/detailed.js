const state = {
  id: sessionStorage.getItem("infoId") || "",
  title: sessionStorage.getItem("infoTitle") || ""
}
const getters = {}
const mutations = {
  updateState(state,value){
    state.id = value.id
    state.title = value.title
    sessionStorage.setItem("infoId",value.id)
    sessionStorage.setItem("infoTitle",value.title)
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
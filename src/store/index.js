import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login"
import app from "./modules/app"
import user from "./modules/user"
import detailed from "./modules/detailed"
import permission from "./modules/permission"
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login, app, user, detailed, permission
  }
});

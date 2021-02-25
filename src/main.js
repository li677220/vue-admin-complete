import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api"
import "./router/guard"
import "./icons"  //引入图标模板
Vue.use(ElementUI);
Vue.use(VueCompositionApi)

Vue.config.productionTip = false;

// 运行时模式
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");



/**
 * vue两种模式
 * runtime：运行时模式
 * compiler： 模板模式
 * 默认为runtime模式，指向 vue/dist/vue.runtime.common.js
 * compiler指向 vue/dist/vue.js
 */


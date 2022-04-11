import Vue from "vue";
import App from "./App.vue";

import Vuex from "vuex";

import Store from "./store/index";

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store(Store);

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");

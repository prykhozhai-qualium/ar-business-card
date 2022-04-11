import Vue from "vue";
import App from "./App.vue";

import Vuex from "vuex";

import Store from "./store/index";

import VueRouter from "vue-router";

import Home from "./views/Home.vue";

Vue.config.productionTip = false;

const router = new VueRouter({
  routes: [
    {
      path: "/:id?",
      component: Home,
    },
  ],
});

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store(Store);

new Vue({
  router,
  render: (h) => h(App),
  store,
}).$mount("#app");

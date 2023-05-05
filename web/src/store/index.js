import { createStore } from "vuex";
import ModuleUser from "./user"; //将写好的引入进来

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: ModuleUser, //后面使用的$store.stata.user的user就是这个user
  },
});

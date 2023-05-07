import { createStore } from "vuex";
import ModuleUser from "./user"; //将写好的引入进来
import ModulePk from "./pk";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},

  //将module作为全局变量的分类
  modules: {
    user: ModuleUser, //后面使用的$store.stata.user的user就是这个user
    pk: ModulePk,
  },
});

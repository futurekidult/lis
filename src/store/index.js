import { createStore } from 'vuex';
//引入子模块
import demo from './demo/index.js';

const store = createStore({
  modules: {
    demo
  },
  state() {
    return {};
  },
  mutations: {},
  actions: {
    //异步操作,执行axios请求
    //......
  },
  getters: {}
});

export default store;

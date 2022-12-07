import { createStore } from 'vuex';
import logistics from './logistics/index.js';

const store = createStore({
  modules: {
    logistics
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

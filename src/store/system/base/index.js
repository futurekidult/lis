import { ElMessage } from 'element-plus';
import axios from '../../../utils/axios.js';

export default {
  namespaced: true,
  state() {
    return {
      logisticSupplier: [],
      listLength: 0,
      mapList: []
    };
  },
  mutations: {
    setLogisticSupplier(state, payload) {
      state.logisticSupplier = payload.list;
      state.listLength = payload.total;
    },
    setMapList(state, payload) {
      state.mapList = payload;
    }
  },
  actions: {
    async getLogisticSupplier(context, payload) {
      await axios
        .get('system/base/logistic-supplier-list', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setLogisticSupplier', {
              list: res.data.list,
              total: res.data.total
            });
          }
        });
    },
    async getMap(context, payload) {
      await axios
        .get('system/base/logistic-supplier-map-list', payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setMapList', res.data.list);
          }
        });
    },
    async createMap(_, payload) {
      await axios
        .post('system/base/logistic-supplier-map-create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async deleteMap(_, payload) {
      await axios
        .post('system/base/logistic-supplier-map-delete', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    }
  }
};

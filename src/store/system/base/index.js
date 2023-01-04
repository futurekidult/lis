import { ElMessage } from 'element-plus';
import axios from '../../../utils/axios.js';
import { timestampToTime } from '../../../utils/index.js';

export default {
  namespaced: true,
  state() {
    return {
      logisticSupplier: [],
      listLength: 0,
      mapList: [],
      overseaLocation: [],
      overseaLocationLength: 0
    };
  },
  mutations: {
    setLogisticSupplier(state, payload) {
      state.logisticSupplier = payload.list;
      state.listLength = payload.total;
    },
    setMapList(state, payload) {
      state.mapList = payload;
    },
    setOverseaLocation(state, payload) {
      state.overseaLocation = payload.list;
      state.overseaLocationLength = payload.total;
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
    },
    async getOverseaLocation(context, payload) {
      await axios
        .get('system/base/oversea-location-list', payload)
        .then((res) => {
          if (res.code === 200) {
            res.data.list.forEach((item) => {
              item.create_time = timestampToTime(item.create_time);
            });
            context.commit('setOverseaLocation', {
              list: res.data.list,
              total: res.data.total
            });
          }
        });
    },
    async createOverseaLocation(_, payload) {
      await axios
        .post('system/base/oversea-location-create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async updateOverseaLocation(_, payload) {
      await axios
        .post('system/base/oversea-location-update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    }
  }
};

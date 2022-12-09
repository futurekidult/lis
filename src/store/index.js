import { createStore } from 'vuex';
import logistics from './logistics/index.js';
import axios from '../utils/axios.js';
import { cache } from '../utils/index.js';

const store = createStore({
  modules: {
    logistics
  },
  state() {
    return {
      warehouse: [],
      sku: [],
      order: []
    };
  },
  mutations: {
    setWarehouse(state, payload) {
      state.warehouse = payload;
    },
    setSku(state, payload) {
      state.sku = payload;
    },
    setOrder(state, payload) {
      state.order = payload;
    }
  },
  actions: {
    async getLogisticSupplier() {
      await axios.get('option/logistic-supplier-list').then((res) => {
        if (res.code === 200) {
          cache('logistic_supplier', JSON.stringify(res.data.list), 3600 * 24);
        }
      });
    },
    async getOverseaLocation() {
      await axios.get('option/oversea-location-list').then((res) => {
        if (res.code === 200) {
          cache('oversea_location', JSON.stringify(res.data.list), 3600 * 24);
        }
      });
    },
    async getWarehouseArea() {
      await axios.get('option/warehouse-area-list').then((res) => {
        if (res.code === 200) {
          cache('warehouse_area', JSON.stringify(res.data.list), 3600 * 24);
        }
      });
    },
    async getWarehouse(context, payload) {
      await axios.get('option/warehouse-list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setWarehouse', res.data.list);
        }
      });
    },
    async getPlatform() {
      await axios.get('option/platform-list').then((res) => {
        if (res.code === 200) {
          cache('platform', JSON.stringify(res.data.list), 3600 * 24);
        }
      });
    },
    async getShop() {
      await axios.get('option/shop-list').then((res) => {
        if (res.code === 200) {
          cache('shop', JSON.stringify(res.data.list), 3600 * 24);
        }
      });
    },
    async getLabel() {
      await axios.get('option/label-list').then((res) => {
        if (res.code === 200) {
          cache('label', JSON.stringify(res.data.list), 3600 * 24);
        }
      });
    },
    async getSystemParameter() {
      await axios.get('option/system-parameter-list').then((res) => {
        if (res.code === 200) {
          cache('parcel_type', JSON.stringify(res.data.parcel_type), 3600 * 24);
          cache(
            'exception_handling',
            JSON.stringify(res.data.exception_handling),
            3600 * 24
          );
        }
      });
    },
    async getSku(context, payload) {
      await axios.get('option/sku-list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSku', res.data.list);
        }
      });
    },
    async getOrder(context, payload) {
      await axios.get('option/order-list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setOrder', res.data.list);
        }
      });
    }
  }
});

export default store;

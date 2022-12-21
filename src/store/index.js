import { createStore } from 'vuex';
import logistics from './logistics/index.js';
import statistics from './statistics/index.js';
import axios from '../utils/axios.js';
import { cache } from '../utils/index.js';
import { ElMessage } from 'element-plus';

const store = createStore({
  modules: {
    logistics,
    statistics
  },
  state() {
    return {
      warehouse: [],
      sku: [],
      order: [],
      adminInfo: {},
      menuVisible: false
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
    },
    setAdminInfo(state, payload) {
      state.adminInfo = payload;
    },
    setMenuVisible(state, payload) {
      state.menuVisible = payload;
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
          if (payload) {
            context.commit('setWarehouse', res.data.list);
          } else {
            cache('warehouse', JSON.stringify(res.data.list), 3600 * 24);
          }
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
    },
    async getCsrfToken() {
      await axios.get('csrftoken-get').then((res) => {
        if (res.code === 200) {
          localStorage.setItem('logistics-token', res.data.csrftoken);
        }
      });
    },
    // async login() {
    //   await axios.post('login?id=14').then((res) => {
    //     if (res.code === 200) {
    //       ElMessage.success(res.message);
    //     }
    //   });
    // },
    async getAdminInfo(context) {
      context.dispatch('getCsrfToken');
      // context.dispatch('login');
      await axios.get('admin-info').then((res) => {
        if (res.code === 200) {
          if (res.data.menu.list.length > 0) {
            context.commit('setMenuVisible', true);
          }
          context.commit('setAdminInfo', res.data);
        }
      });
    },
    async logout() {
      await axios.get('logout').then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getCountry() {
      await axios.get('option/country-list').then((res) => {
        if (res.code === 200) {
          cache(
            'logistics-country',
            JSON.stringify(res.data.list),
            3600 * 24 * 30 * 3
          );
        }
      });
    },
    async getState(_, payload) {
      await axios.get('option/state-list', payload).then((res) => {
        if (res.code === 200) {
          if (res.data.list.length) {
            cache(
              `logistics-state-${payload.params.country_id}`,
              JSON.stringify(res.data.list),
              3600 * 24 * 30 * 3
            );
          }
        }
      });
    },
    async getCity(_, payload) {
      let params = payload.params;
      await axios.get('option/city-list', payload).then((res) => {
        if (res.code === 200) {
          if (res.data.list.length) {
            cache(
              `logistics-city-${params.state_id}-${params.country_id}`,
              JSON.stringify(res.data.list),
              3600 * 24 * 30 * 3
            );
          }
        }
      });
    }
  }
});

export default store;

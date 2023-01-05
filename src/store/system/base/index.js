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
      overseaLocationLength: 0,
      warehouseArea: [],
      warehouseAreaLength: 0,
      warehouse: [],
      warehouseLength: 0,
      platform: [],
      platformLength: 0,
      label: [],
      labelLength: 0,
      shop: [],
      shopLength: 0,
      shopError: {},
      sku: [],
      skuLength: 0,
      skuError: {}
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
    },
    setWarehouseArea(state, payload) {
      state.warehouseArea = payload.list;
      state.warehouseAreaLength = payload.total;
    },
    setPlatform(state, payload) {
      state.platform = payload.list;
      state.platformLength = payload.total;
    },
    setLabel(state, payload) {
      state.label = payload.list;
      state.labelLength = payload.total;
    },
    setShop(state, payload) {
      state.shop = payload.list;
      state.shopLength = payload.total;
    },
    setShopError(state, payload) {
      state.shopError = payload;
    },
    setSku(state, payload) {
      state.sku = payload.list;
      state.skuLength = payload.total;
    },
    setSkuError(state, payload) {
      state.skuError = payload;
    },
    setWarehouse(state, payload) {
      state.warehouse = payload.list;
      state.warehouseLength = payload.total;
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
    },
    async getWarehouseArea(context, payload) {
      await axios
        .get('system/base/warehouse-area-list', payload)
        .then((res) => {
          if (res.code === 200) {
            res.data.list.forEach((item) => {
              item.create_time = timestampToTime(item.create_time);
            });
            context.commit('setWarehouseArea', {
              list: res.data.list,
              total: res.data.total
            });
          }
        });
    },
    async createWarehouseArea(_, payload) {
      await axios
        .post('system/base/warehouse-area-create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async updateWarehouseArea(_, payload) {
      await axios
        .post('system/base/warehouse-area-update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getPlatform(context, payload) {
      await axios.get('system/base/platform-list', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.create_time = timestampToTime(item.create_time);
          });
          context.commit('setPlatform', {
            list: res.data.list,
            total: res.data.total
          });
        }
      });
    },
    async createPlatform(_, payload) {
      await axios.post('system/base/platform-create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updatePlatform(_, payload) {
      await axios.post('system/base/platform-update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getLabel(context, payload) {
      await axios.get('system/base/label-list', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.create_time = timestampToTime(item.create_time);
          });
          context.commit('setLabel', {
            list: res.data.list,
            total: res.data.total
          });
        }
      });
    },
    async createLabel(_, payload) {
      await axios.post('system/base/label-create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateLabel(_, payload) {
      await axios.post('system/base/label-update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getShop(context, payload) {
      await axios.get('system/base/shop-list', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.create_time = timestampToTime(item.create_time);
          });
          context.commit('setShop', {
            list: res.data.list,
            total: res.data.total
          });
        }
      });
    },
    async createShop(context, payload) {
      await axios.post('system/base/shop-create', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setShopError', {});
          ElMessage.success(`${res.data.success_count}条数据新增成功`);
        } else if (res.code === 40015) {
          context.commit('setShopError', res.data);
        }
      });
    },
    async updateShop(_, payload) {
      await axios.post('system/base/shop-update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getSku(context, payload) {
      await axios.get('system/base/sku-list', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.create_time = timestampToTime(item.create_time);
          });
          context.commit('setSku', {
            list: res.data.list,
            total: res.data.total
          });
        }
      });
    },
    async createSku(context, payload) {
      await axios.post('system/base/sku-create', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSkuError', {});
          ElMessage.success(`${res.data.success_count}条数据新增成功`);
        } else if (res.code === 40015) {
          context.commit('setSkuError', res.data);
        }
      });
    },
    async updateSku(_, payload) {
      await axios.post('system/base/sku-update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getWarehouse(context, payload) {
      await axios.get('system/base/warehouse-list', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.create_time = timestampToTime(item.create_time);
          });
          context.commit('setWarehouse', {
            list: res.data.list,
            total: res.data.total
          });
        }
      });
    },
    async createWarehouse(_, payload) {
      await axios.post('system/base/warehouse-create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateWarehouse(_, payload) {
      await axios.post('system/base/warehouse-update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};

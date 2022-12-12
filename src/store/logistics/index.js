import axios from '../../utils/axios';
import { handleTimestamp } from '../../utils/index';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      listData: [],
      listTotal: 0,
      orderDetail: {},
      listLoading: true,
      transitStateStatistics: {}
    };
  },
  mutations: {
    setListData(state, payload) {
      state.listData = payload.list;
      state.listTotal = payload.total;
      state.transitStateStatistics = payload.transit_state_statistics;
    },
    setListLoading(state, payload) {
      state.listLoading = payload;
    },
    setOrderDetail(state, payload) {
      state.orderDetail = payload;
    }
  },
  actions: {
    async getListData(context, payload) {
      let listParams = JSON.parse(JSON.stringify(payload));
      // 删除多传的参数
      delete listParams.params.create_time;
      delete listParams.params.shipping_time;
      await axios.get('waybill-list', listParams).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            // 最新轨迹停留时长计算
            if (
              item.transit_state !== 70 ||
              item.transit_state !== 80 ||
              (item.transit_state === 60 && item.exception_handing === 10)
            ) {
              let currentTime = new Date().getTime();
              let eventTime = item.current_event_time;
              let time = (currentTime - eventTime * 1000) / 1000 / 60 / 60 / 24;
              // 保留一位小数，并向上取整
              item.stay_time = `${Math.ceil(time.toFixed(1))}天`;
            }
            //时间戳转化
            handleTimestamp(item, [
              'sync_time',
              'create_time',
              'shipping_time',
              'current_event_time',
              'estimated_delivery_time'
            ]);
            // 字符串拼接
            item.receipt_days = `${item.receipt_days}天`;
            item.delivery_days = `${item.delivery_days}天`;
          });
          context.commit('setListData', res.data);
          context.commit('setListLoading', false);
        }
      });
    },
    async createOrder(_, payload) {
      await axios.post('order/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateOrder(_, payload) {
      await axios.post('order/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getOrderDetail(context, payload) {
      await axios.get('order/detail', payload).then((res) => {
        if (res.code === 200) {
          res.data.payment_time = res.data.payment_time * 1000;
          context.commit('setOrderDetail', res.data);
        }
      });
    },
    async updateLogisticSupplier(_, payload) {
      await axios
        .post('waybill/logistic-supplier-update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async updateExceptionHandling(_, payload) {
      await axios
        .post('waybill/exception-handling-update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async deleteWaybill(_, payload) {
      await axios.post('waybill/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  },
  getters: {}
};

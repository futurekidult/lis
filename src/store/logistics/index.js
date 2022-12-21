import axios from '../../utils/axios';
import {
  handleTimestamp,
  timestampToTime,
  timeToTimestamp,
  download
} from '../../utils/index';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      listData: [],
      listTotal: 0,
      orderDetail: {},
      listLoading: true,
      transitStateStatistics: {},
      baseWaybillDetail: {},
      waybillDetail: {},
      error: {},
      stepActive: 1
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
    },
    setBaseWaybillDetail(state, payload) {
      state.baseWaybillDetail = payload;
    },
    setWaybillDetail(state, payload) {
      state.waybillDetail = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setStepActive(state, payload) {
      state.stepActive = payload;
    }
  },
  actions: {
    async getListData(context, payload) {
      let listParams = JSON.parse(JSON.stringify(payload));
      // 删除多传的参数
      delete listParams.params.create_time;
      delete listParams.params.shipping_time;
      await axios.get('waybill/waybill-list', listParams).then((res) => {
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
    },
    async updateWaybillLabel(_, payload) {
      await axios.post('waybill/label-update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async deleteWaybillLabel(_, payload) {
      await axios.post('waybill/label-delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getBaseWaybillDetail(context, payload) {
      await axios.get('waybill/detail-base', payload).then((res) => {
        if (res.code === 200) {
          res.data.shipping_time = timestampToTime(res.data.shipping_time);
          context.commit('setBaseWaybillDetail', res.data);
        }
      });
    },
    async getWaybillDetail(context, payload) {
      await axios.get('waybill/detail', payload).then((res) => {
        if (res.code === 200) {
          handleTimestamp(res.data, [
            'sync_time',
            'receipt_time',
            'delivery_time',
            'payment_time',
            'shipping_time',
            'current_event_time',
            'estimated_delivery_time'
          ]);
          res.data.receipt_days = `${res.data.receipt_days}天`;
          res.data.delivery_days = `${res.data.delivery_days}天`;
          res.data.logistic_tracking.forEach((item) => {
            item.event_time = timestampToTime(item.event_time);
          });
          context.commit('setWaybillDetail', res.data);
        }
      });
    },
    async asyncWaybillInfo(_, payload) {
      await axios.post('waybill/detail-synchronize', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateWaybill(_, payload) {
      let params = payload;
      params.state_id = params.state;
      params.city_id = params.city;
      params.shipping_time = timeToTimestamp(params.shipping_time);
      await axios.post('waybill/update', params).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async exportTemplate() {
      await axios({
        url: 'waybill/export-template',
        method: 'post',
        responseType: 'blob'
      }).then((res) => {
        if (res.type !== 'application/json') {
          download(
            res,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '物流跟踪模板',
            'xlsx'
          );
        }
      });
    },
    async importWaybill(context, payload) {
      await axios
        .post('waybill/import', payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else if (res.code === 40015) {
            context.commit('setError', res.data);
            context.commit('setStepActive', 2);
          }
        });
    },
    async exportWaybill(_, payload) {
      let body = JSON.parse(JSON.stringify(payload));
      // 删除多传的参数
      delete body.create_time;
      delete body.shipping_time;
      delete body.current_page;
      delete body.page_size;
      await axios({
        url: 'waybill/export',
        method: 'post',
        data: body,
        responseType: 'blob'
      }).then((res) => {
        if (res.type !== 'application/json') {
          download(res, 'text/csv', '物流运单列表', 'csv');
        }
      });
    }
  },
  getters: {}
};

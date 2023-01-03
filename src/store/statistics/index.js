import axios from '../../utils/axios';
import { download } from '../../utils/index.js';
import { timestampToTime, toPercent } from '../../utils';

export default {
  namespaced: true,
  state() {
    return {
      dailyStatistics: [],
      dailyTableVisible: false,
      logisticSupplier: [],
      emptyList: [],
      dailyLoading: true,
      averageStatistics: [],
      averageTableVisible: false,
      averageEmptyList: [],
      averageLoading: true,
      averageList: [],
      averageDetail: [],
      isDateChange: false
    };
  },
  mutations: {
    setDailyStatistics(state, payload) {
      state.dailyStatistics = payload.list;
      state.emptyList = payload.empty_list;
    },
    setDailyTableVisible(state, payload) {
      state.dailyTableVisible = payload;
    },
    setLogisticSupplier(state, payload) {
      state.logisticSupplier = payload;
    },
    setDailyLoading(state, payload) {
      state.dailyLoading = payload;
    },
    setAverageStatistics(state, payload) {
      state.averageStatistics = payload.list;
      state.averageEmptyList = payload.empty_list;
      state.averageList = payload.average_statistics;
    },
    setAverageTableVisible(state, payload) {
      state.averageTableVisible = payload;
    },
    setAverageLoading(state, payload) {
      state.averageLoading = payload;
    },
    setAverageDetail(state, payload) {
      state.averageDetail = payload;
    },
    setDateChange(state, payload) {
      state.isDateChange = payload;
    }
  },
  actions: {
    async getDailyStatistics(context, payload) {
      await axios.get('statistics/daily', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.data.forEach((data) => {
              data.shipping_time = timestampToTime(data.shipping_time, false);
              toPercent(data, [
                'receipt_2days_rate',
                'receipt_3days_rate',
                'delivery_rate'
              ]);
            });
          });
          context.commit('setDailyStatistics', res.data);
          context.commit('setDailyTableVisible', true);
          context.commit('setDailyLoading', false);
        }
      });
    },
    async getLogisticSupplier(context, payload) {
      await axios.get('statistics/daily-detail', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((data) => {
            toPercent(data, [
              'receipt_2days_rate',
              'receipt_3days_rate',
              'delivery_rate'
            ]);
          });
          context.commit('setLogisticSupplier', res.data.list);
        }
      });
    },
    async exportDailyStatistics(_, payload) {
      await axios({
        url: 'statistics/daily-export',
        method: 'post',
        data: payload,
        responseType: 'blob'
      }).then((res) => {
        download(
          res,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          '每日物流时效表',
          'xlsx'
        );
      });
    },
    async getAverageStatistics(context, payload) {
      await axios.get('statistics/average', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            item.table.data.forEach((data) => {
              toPercent(data, [
                'receipt_2days_rate',
                'receipt_3days_rate',
                'delivery_rate'
              ]);
            });
          });
          res.data.average_statistics.forEach((item) => {
            toPercent(item, [
              'receipt_2days_rate',
              'receipt_3days_rate',
              'delivery_rate'
            ]);
          });
          context.commit('setAverageStatistics', res.data);
          context.commit('setAverageTableVisible', true);
          context.commit('setAverageLoading', false);
        }
      });
    },
    async getAverageDetail(context, payload) {
      await axios.get('statistics/average-detail', payload).then((res) => {
        if (res.code === 200) {
          res.data.list.forEach((item) => {
            toPercent(item, [
              'receipt_2days_rate',
              'receipt_3days_rate',
              'delivery_rate'
            ]);
          });
          context.commit('setAverageDetail', res.data.list);
        }
      });
    },
    async exportAverageStatistics(_, payload) {
      await axios({
        url: 'statistics/average-export',
        method: 'post',
        data: payload,
        responseType: 'blob'
      }).then((res) => {
        download(
          res,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          '平均物流时效表',
          'xlsx'
        );
      });
    }
  }
};

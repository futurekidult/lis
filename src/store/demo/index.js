// import axios from '../../utils/axios';
import { timestampToTime } from '../../utils/index';

export default {
  namespaced: true,
  state() {
    return {
      listData: []
    };
  },
  mutations: {
    getListData(state, payload) {
      state.listData = payload;
    }
  },
  actions: {
    async getListData(context) {
      // await axios.get('', payload).then((res) => {
      //   if (res.code === 200) {
      let data = [
        {
          id: 1,
          name: 'test',
          department: 'IT部',
          state: 1,
          state_desc: '正常',
          create_time: 1667282724
        }
      ];
      data.forEach((item) => {
        item.create_time = timestampToTime(item.create_time);
      });
      context.commit('getListData', data);
      //   }
      // });
    }
  },
  getters: {}
};

<template>
  <section>
    <common-statistics
      :properties="$global.dailyChooseOptions"
      type="daily"
      :visible="$store.state.statistics.dailyTableVisible"
      @get-form="getForm"
    >
      <daily-table
        :form="form"
        :list="dailyStatistics"
        :empty="emptyList"
        :dimension="dimension"
      />
    </common-statistics>
  </section>
</template>

<script>
import CommonStatistics from '../common-statistics.vue';
import DailyTable from './daily-table.vue';

export default {
  components: {
    CommonStatistics,
    DailyTable
  },
  data() {
    return {
      dailyStatistics: [],
      form: {},
      emptyList: [],
      dimension: null
    };
  },
  methods: {
    async getForm(obj) {
      this.form = obj.params;
      this.dimension = obj.params.statistical_dimension;
      if (obj.request) {
        if (!this.form.start_shipping_time || !this.form.end_shipping_time) {
          this.$message.warning('发货时间为必填项');
        } else {
          this.$store.commit('statistics/setDailyLoading', true);
          try {
            await this.$store.dispatch('statistics/getDailyStatistics', {
              params: obj.params
            });
            this.dailyStatistics = this.$store.state.statistics.dailyStatistics;
            this.emptyList = this.$store.state.statistics.emptyList;
            if (!this.dailyStatistics.length && !this.emptyList.length) {
              this.$store.commit('statistics/setDailyTableVisible', false);
              this.$message.warning('当前查询结果为空');
            }
            this.$store.commit('statistics/setDailyLoading', false);
          } catch (err) {
            this.$store.commit('statistics/setDailyLoading', false);
            return;
          }
        }
      }
    }
  }
};
</script>

<template>
  <section>
    <common-statistics
      :properties="$global.averageChooseOptions"
      type="average"
      :visible="$store.state.statistics.averageTableVisible"
      @get-form="getForm"
    >
      <average-chart
        :data="averageStatistics"
        :empty="emptyList"
      />

      <el-table
        v-if="averageList.length"
        :data="averageList"
        border
      >
        <template
          v-for="item in listFields"
          :key="item.prop"
        >
          <el-table-column
            v-if="item.prop !== 'count'"
            :label="item.label"
            align="center"
          >
            <template #default="scope">
              <span
                :style="
                  scope.row[item.prop].indexOf('%') > -1
                    ? { color: changeRateColor(scope.row[item.prop]) }
                    : {}
                "
              >{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :label="item.label"
            align="center"
          >
            <template #default="scope">
              <el-button
                text
                type="primary"
                @click="viewSingleAverage(scope.row.id, scope.row.count)"
              >
                {{ scope.row.count }}
              </el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <base-option
        v-model="averageVisible"
        :title="`${title}平均时效统计`"
      >
        <statistics-table
          :table="table"
          :name="lastLabel"
        />
      </base-option>
    </common-statistics>
  </section>
</template>

<script>
import CommonStatistics from '../common-statistics.vue';
import AverageChart from './average-chart.vue';
import StatisticsTable from '../statistics-table.vue';
import { changeRateColor } from '../../../../../utils/index.js';
export default {
  components: {
    CommonStatistics,
    AverageChart,
    StatisticsTable
  },
  data() {
    return {
      form: {},
      averageStatistics: [],
      emptyList: [],
      averageList: [],
      listFields: [],
      averageVisible: false,
      table: {},
      firstLabel: [],
      lastLabel: [],
      title: '',
      dimension: null
    };
  },
  mounted() {
    this.$store.commit('statistics/setAverageTableVisible', false);
  },
  methods: {
    changeRateColor,
    async getForm(obj) {
      this.form = obj.params;
      this.dimension = obj.params.statistical_dimension;
      if (obj.request) {
        if (this.form.shipping_time_unit !== 'y' && !this.form.year) {
          this.$message.warning('发货时间在选择按周/按月时，年份是必填的');
        } else if (!this.form.shipping_time_unit) {
          this.$message.warning('发货时间单位为必填项');
        } else if (
          !this.form.start_shipping_time ||
          !this.form.end_shipping_time
        ) {
          this.$message.warning('发货时间区间为必填项');
        } else {
          this.$store.commit('statistics/setAverageLoading', true);
          try {
            await this.$store.dispatch('statistics/getAverageStatistics', {
              params: obj.params
            });
            this.averageStatistics =
              this.$store.state.statistics.averageStatistics;
            this.emptyList = this.$store.state.statistics.averageEmptyList;
            this.averageList = this.$store.state.statistics.averageList;
            this.firstLabel = this.$global.statisticalDimension.find((item) => {
              return item.value === this.dimension;
            }).label;
            this.lastLabel = this.$global.titleMap[this.dimension];
            this.listFields = [
              {
                label: this.firstLabel,
                prop: 'name'
              }
            ].concat(this.$global.commonListFields);
            this.listFields = this.listFields.concat([
              {
                label: this.lastLabel,
                prop: 'count'
              }
            ]);
            if (
              !this.averageStatistics.length &&
              !this.emptyList.length &&
              !this.averageList.length
            ) {
              this.$store.commit('statistics/setAverageTableVisible', false);
              this.$message.warning('当前查询结果为空');
            }
            this.$store.commit('statistics/setAverageLoading', false);
          } catch (err) {
            this.$store.commit('statistics/setAverageLoading', false);
            return;
          }
        }
      }
    },
    async viewSingleAverage(id, count) {
      if (count !== '-' && count !== 0) {
        let params = this.form;
        params.statistical_dimension_id = id;
        try {
          await this.$store.dispatch('statistics/getAverageDetail', { params });
          this.averageDetail = this.$store.state.statistics.averageDetail;
          this.table = {
            tableData: this.averageDetail,
            tableFields: [
              {
                label: `${this.lastLabel}名称`,
                prop: 'name'
              }
            ].concat(this.$global.commonListFields)
          };
          this.title = this.lastLabel.substring(0, this.lastLabel.length - 2);
          this.averageVisible = true;
        } catch (err) {
          return;
        }
      } else {
        this.$message.warning('当前无数据可查看');
      }
    }
  }
};
</script>

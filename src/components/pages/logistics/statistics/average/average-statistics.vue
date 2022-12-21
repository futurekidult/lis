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
        :form="form"
        :empty="emptyList"
        :dimension="dimension"
      />

      <el-table
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
                @click="viewSingleAverage(scope.row.id)"
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
  methods: {
    changeRateColor,
    async getForm(obj) {
      this.form = obj.params;
      this.dimension = obj.params.statistical_dimension;
      if (obj.request) {
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
          this.$store.commit('statistics/setAverageLoading', false);
        } catch (err) {
          this.$store.commit('statistics/setAverageLoading', false);
          return;
        }
      }
    },
    async viewSingleAverage(id) {
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
    }
  }
};
</script>

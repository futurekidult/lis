<template>
  <section v-loading="$store.state.statistics.dailyLoading">
    <div
      v-if="empty.length"
      style="color: #ea1d1d; margin: 10px"
    >
      提示：{{ emptyStr }}
    </div>
    <el-scrollbar :height="originData.length ? '600px' : ''">
      <div
        v-for="(data, i) in originData"
        :key="i"
        style="margin: 20px 0"
      >
        <div>{{ data.name }}</div>
        <el-table
          border
          style="margin-top: 20px; width: 99%"
          :data="data.data"
          :show-header="false"
        >
          <el-table-column
            v-for="(item, index) in data.data[i].length"
            :key="index"
            :class-name="index === 0 ? 'column-header' : ''"
            align="center"
            min-width="150px"
          >
            <template #default="{ row }">
              <el-button
                v-if="row[0].indexOf('数量') !== -1 && index !== 0"
                text
                type="primary"
                @click="
                  viewLogisticSupplier(data.id, row[index], data.data[0][index])
                "
              >
                {{ row[index] }}
              </el-button>
              <span
                v-else
                :style="
                  row[index].indexOf('%') > -1
                    ? { color: changeRateColor(row[index]) }
                    : {}
                "
              >
                {{ row[index] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-scrollbar>

    <base-option
      v-model="logisticSupplierVisible"
      :title="`${title}每日时效统计`"
    >
      <statistics-table :table="table" />
    </base-option>
  </section>
</template>

<script>
import {
  timeToTimestamp,
  changeRateColor,
  transposeArray,
  getEmptyList
} from '../../../../../utils/index.js';
import StatisticsTable from '../statistics-table.vue';

export default {
  components: {
    StatisticsTable
  },
  props: {
    list: {
      type: Array,
      default: null
    },
    form: {
      type: Object,
      default: null
    },
    empty: {
      type: Array,
      default: null
    },
    dimension: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      originData: this.list,
      originTitle: this.$global.dailyRate,
      logisticSupplierVisible: false,
      table: {},
      emptyStr: '',
      chooseForm: this.form,
      lastLabel: [],
      title: ''
    };
  },
  watch: {
    list(val) {
      this.originData = val;
      this.handleArray();
    },
    form(val) {
      this.chooseForm = val;
    }
  },
  methods: {
    changeRateColor,
    //数组转置
    handleArray() {
      this.originTitle.push(this.$global.titleMap[this.dimension]);
      for (const index in this.originData) {
        this.originData[index].data = transposeArray(
          this.originData[index].data,
          this.originTitle
        );
      }
      this.emptyStr = getEmptyList(this.empty);
      this.originTitle.pop();
    },
    async viewLogisticSupplier(id, val, item) {
      if (parseFloat(val) && val !== '-') {
        let params = JSON.parse(JSON.stringify(this.chooseForm));
        params.shipping_time = timeToTimestamp(item);
        params.statistical_dimension_id = id;
        delete params.end_shipping_time;
        delete params.start_shipping_time;
        try {
          await this.$store.dispatch('statistics/getLogisticSupplier', {
            params
          });
          this.logisticSupplier = this.$store.state.statistics.logisticSupplier;
          this.lastLabel = this.$global.titleMap[this.dimension];
          this.table = {
            tableData: this.logisticSupplier,
            tableFields: [
              {
                label: `${this.lastLabel}名称`,
                prop: 'name'
              }
            ].concat(this.$global.commonListFields)
          };
          this.title = this.lastLabel.substring(0, this.lastLabel.length - 2);
          this.logisticSupplierVisible = true;
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

<style scoped>
.el-table ::v-deep .column-header {
  font-weight: bold;
  position: sticky;
  left: 0;
  background: #f7f7f7;
  z-index: 100;
}
</style>

<template>
  <section v-loading="$store.state.statistics.dailyLoading">
    <div
      v-if="empty.length"
      style="color: #ea1d1d; margin: 10px"
    >
      提示：{{ emptyStr }}
    </div>
    <el-scrollbar height="600px">
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

    <base-option v-model="logisticSupplierVisible">
      <el-scrollbar height="400px">
        <el-table
          :data="table.tableData"
          border
        >
          <el-table-column
            v-for="item in table.tableFields"
            :key="item.prop"
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
        </el-table>
      </el-scrollbar>
    </base-option>
  </section>
</template>

<script>
import {
  timeToTimestamp,
  changeRateColor,
  transposeArray
} from '../../../../../utils/index.js';

export default {
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
      originTitle: [
        '发货时间',
        '2天首枪时效合格率',
        '3天首枪时效合格率',
        '送达时效合格率'
      ],
      titleMap: {
        10: '仓库数量',
        20: '物流商数量',
        30: 'SKU数量',
        40: '店铺数量'
      },
      logisticSupplierVisible: false,
      table: {},
      emptyStr: '',
      chooseForm: this.form
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
      this.originTitle.push(this.titleMap[this.dimension]);
      for (const index in this.originData) {
        this.originData[index].data = transposeArray(
          this.originData[index].data,
          this.originTitle
        );
      }
      if (this.empty.length) {
        let emptyArr = [];
        for (const index in this.empty) {
          emptyArr.push(this.empty[index].name);
        }
        this.emptyStr = `${emptyArr.join('、')}无数据`;
      }
      this.originTitle.pop();
    },
    async viewLogisticSupplier(id, val, item) {
      if (parseFloat(val) && val !== '-') {
        let params = JSON.parse(JSON.stringify(this.chooseForm));
        params.statistical_dimension_type = params.statistical_dimension;
        params.shipping_time = timeToTimestamp(item);
        params.statistical_dimension_id = id;
        delete params.statistical_dimension;
        delete params.end_shipping_time;
        delete params.start_shipping_time;
        try {
          await this.$store.dispatch('statistics/getLogisticSupplier', {
            params
          });
          this.logisticSupplier = this.$store.state.statistics.logisticSupplier;
          this.table = {
            tableData: this.logisticSupplier,
            tableFields: [
              {
                label: '物流商名称',
                prop: 'name'
              },
              {
                label: '2天首枪时效合格率',
                prop: 'receipt_2days_rate'
              },
              {
                label: '3天首枪时效合格率',
                prop: 'receipt_3days_rate'
              },
              {
                label: '送达时效合格率',
                prop: 'delivery_rate'
              }
            ]
          };
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

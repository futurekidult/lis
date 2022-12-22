<template>
  <section>
    <section class="section-border">
      <div class="select-title">
        <el-divider direction="vertical" /> 统计维度
      </div>
      <div>
        <el-radio-group v-model="dimension">
          <el-radio
            v-for="item in $global.statisticalDimension"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </div>
    </section>
    <section class="section-border">
      <div class="select-title">
        <el-divider direction="vertical" /> 筛选条件
      </div>
      <base-form
        :properties="properties"
        :base-form="chooseForm"
        :inline="true"
        width="130px"
        @get-warehouse="getWarehouse"
        @get-date="getDate"
      >
        <el-button
          type="primary"
          @click="queryList"
        >
          查询
        </el-button>
        <el-button @click="resetForm">
          重置
        </el-button>
      </base-form>
    </section>
    <section
      v-if="visible"
      class="section-border"
    >
      <div class="select-title flex-between">
        <div><el-divider direction="vertical" /> 图表展示</div>
        <el-button
          type="primary"
          @click="exportStatistics"
        >
          导出
        </el-button>
      </div>
      <slot />
    </section>
  </section>
</template>

<script>
import { handleDateRange, getWeek } from '../../../../utils/index.js';

export default {
  props: {
    properties: {
      type: Array,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  emits: ['get-form'],
  data() {
    return {
      chooseForm: {},
      dimension: null,
      warehouse: []
    };
  },
  mounted() {
    if (this.type === 'daily') {
      this.chooseForm.shipping_time = this.lastMonth();
    }
  },
  methods: {
    getDate(val) {
      if (val) {
        this.chooseForm.shipping_time = val;
        this.$store.commit('statistics/setDateChange', true);
      }
    },
    handleChoose() {
      if (this.type === 'daily') {
        if (!this.$store.state.statistics.isDateChange) {
          this.chooseForm.shipping_time = this.lastMonth();
        }
        handleDateRange(this.chooseForm, 'shipping_time');
      }
      let params = JSON.parse(JSON.stringify(this.chooseForm));
      if (this.chooseForm.warehouse_id.length === 0) {
        params.warehouse_id = this.warehouse;
      }
      for (let i in params) {
        if (Array.isArray(params[i]) && i !== 'shipping_time') {
          params[i] = params[i].join(',');
        }
      }
      return params;
    },
    lastMonth() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
      return [start, end];
    },
    getWarehouse(val) {
      if (this.chooseForm.warehouse_id.length === 0) {
        this.warehouse = val;
      }
    },
    queryList() {
      if (this.dimension) {
        let params = this.handleChoose();
        delete params.shipping_time;
        params.statistical_dimension = this.dimension;
        this.$emit('get-form', {
          params,
          request: true
        });
      } else {
        this.$message.warning('请选择统计维度');
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.dimension = null;
      let params = this.chooseForm;
      params.dimension = null;
      this.chooseForm = {
        warehouse_id: []
      };
      this.warehouse = [];
      if (this.type === 'daily') {
        this.chooseForm.shipping_time = this.lastMonth();
        this.$store.commit('statistics/setDateChange', false);
      } else {
        this.chooseForm.shipping_time_unit = 'w';
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        this.chooseForm.start_shipping_time = getWeek(year, month, day);
        this.chooseForm.end_shipping_time = getWeek(year, month, day);
      }
      this.$emit('get-form', {
        params,
        request: false
      });
      if (this.type === 'daily') {
        this.$store.commit('statistics/setDailyTableVisible', false);
      } else {
        this.$store.commit('statistics/setAverageTableVisible', false);
      }
    },
    async exportStatistics() {
      let body = this.handleChoose();
      delete body.shipping_time;
      body.statistical_dimension = this.dimension;
      try {
        if (this.type === 'daily') {
          await this.$store.dispatch('statistics/exportDailyStatistics', body);
        } else {
          await this.$store.dispatch(
            'statistics/exportAverageStatistics',
            body
          );
        }
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<template>
  <el-scrollbar>
    <el-table
      border
      style="margin-top: 20px; width: 800px"
      :data="originData"
      :show-header="false"
    >
      <el-table-column
        v-for="(item, index) in originData[0].length"
        :key="index"
        :class-name="index === 0 ? 'column-header' : ''"
        align="center"
        min-width="150px"
      >
        <template #default="{ row }">
          <span
            :style="
              row[index].indexOf('%') > -1
                ? { color: changeRateColor(row[index]) }
                : {}
            "
          >
            {{ row[index] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script>
import { transposeArray, changeRateColor } from '../../../../../utils/index.js';
export default {
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      originData: this.list,
      originTitle: this.$global.averageRate
    };
  },
  watch: {
    list: {
      handler(val) {
        this.originData = val;
        this.transposeArray();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeRateColor,
    transposeArray() {
      this.originData = transposeArray(this.originData, this.originTitle);
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

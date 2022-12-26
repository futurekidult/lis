<template>
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
</template>

<script>
import { changeRateColor } from '../../../../utils/index.js';

export default {
  props: {
    table: {
      type: Object,
      default: null
    }
  },
  methods: {
    changeRateColor
  }
};
</script>

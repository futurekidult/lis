<template>
  <el-table
    border
    :data="errorList"
    style="width: 99%"
  >
    <template
      v-for="item in $global.errorTableFields"
      :key="item.prop"
    >
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : '200px'"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row[item.prop].value }}</span>
          <el-popover
            v-if="scope.row[item.prop].error"
            placement="top-start"
            title="错误详情"
            :width="200"
            trigger="click"
            :content="scope.row[item.prop].error"
          >
            <template #reference>
              <el-icon
                color="#EA1D1D"
                class="error-msg"
              >
                <WarningFilled />
              </el-icon>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
import { WarningFilled } from '@element-plus/icons-vue';
export default {
  components: {
    WarningFilled
  },
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      errorList: this.list
    };
  },
  watch: {
    list(val) {
      this.errorList = val;
    }
  }
};
</script>

<style scoped>
.error-msg {
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 0px !important;
  cursor: pointer;
}
</style>

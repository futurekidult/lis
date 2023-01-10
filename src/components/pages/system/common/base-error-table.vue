<template>
  <section>
    <div style="margin-bottom: 20px">
      {{ error.success_count }}条数据新增成功，以下{{
        error.fail_count
      }}条数据新增失败
    </div>
    <el-scrollbar height="200px">
      <el-table
        :data="errorData.errors"
        border
        :header-cell-style="headerStyle"
      >
        <el-table-column
          label="错误"
          prop="msg"
          align="center"
        />
        <el-table-column
          :label="label"
          prop="value"
          align="center"
        />
      </el-table>
    </el-scrollbar>
  </section>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      errorData: this.error
    };
  },
  watch: {
    error(val) {
      this.errorData = val;
    }
  },
  methods: {
    headerStyle({ columnIndex }) {
      if (columnIndex === 0) {
        return {
          color: '#EA1D1D'
        };
      }
    }
  }
};
</script>

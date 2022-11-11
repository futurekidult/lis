<template>
  <main>
    <section
      v-if="$route.meta.formVisible"
      class="section-border"
    >
      <div class="select-title">
        <el-divider direction="vertical" /> 筛选条件
      </div>
      <base-form
        :properties="$route.meta.chooseProperties"
        :base-form="chooseForm"
        :inline="true"
        width="80px"
      >
        <el-button
          type="primary"
          @click="searchForm"
        >
          查询
        </el-button>
        <el-button @click="resetForm">
          重置
        </el-button>
      </base-form>
    </section>
    <section class="section-border">
      <base-table>
        <template #default="slotProps">
          <slot :row="slotProps.row" />
        </template>
      </base-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        small
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>
  </main>
</template>

<script>
import BaseTable from './base-table.vue';
import BaseForm from './base-form.vue';

export default {
  components: {
    BaseTable,
    BaseForm
  },
  inject: ['getTable'],
  emits: ['get-options', 'search-form', 'get-pagination'],
  data() {
    return {
      chooseForm: {},
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    total() {
      return this.getTable().total;
    }
  },
  watch: {
    chooseForm: {
      handler(val) {
        this.$emit('get-options', val);
      },
      deep: true
    },
    currentPage: {
      handler(val) {
        this.$emit('get-pagination', {
          current_page: val,
          page_size: this.pageSize
        });
      },
      immediate: true
    },
    pageSize: {
      handler(val) {
        this.$emit('get-pagination', {
          current_page: this.currentPage,
          page_size: val
        });
      },
      deep: true
    }
  },
  methods: {
    searchForm() {
      this.$emit('search-form');
    },
    resetForm() {
      this.chooseForm = {};
      this.currentPage = 1;
      this.pageSize = 10;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    }
  }
};
</script>

<style scoped>
.select-title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 15px;
}

.el-divider--vertical {
  border-left: 4px rgba(0, 102, 183, 1) solid;
}

.el-pagination {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}
</style>

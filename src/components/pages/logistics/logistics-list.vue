<template>
  <section>
    <section class="section-border">
      <div class="select-title">
        <el-divider direction="vertical" /> 筛选条件
      </div>
      <base-form
        :properties="$global.logisticsChooseOptions"
        :base-form="chooseForm"
        :inline="true"
        width="130px"
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
      v-loading="$store.state.logistics.listLoading"
      class="section-border"
    >
      <div class="select-title">
        <el-divider direction="vertical" /> 运单列表
      </div>
      <el-tabs
        v-model="activeTab"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="tag in $global.transitState"
          :key="tag.key"
          :label="`${tag.label}(${
            $store.state.logistics.transitStateStatistics[tag.name]
          })`"
          :name="tag.name"
        >
          <div class="position-right btn-right">
            <el-button>新增订单信息</el-button>
            <el-button>修改订单信息</el-button>
            <el-button>修改物流商</el-button>
            <el-button>异常已处理</el-button>
            <el-dropdown style="margin: 0 12px">
              <el-button style="width: 80px">
                标记为
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>标签1</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button>删除</el-button>
            <el-dropdown style="margin: 0 12px">
              <el-button style="width: 80px">
                导入
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>导入发货运单</el-dropdown-item>
                  <el-dropdown-item>导入退货运单</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="primary">
              导出
            </el-button>
          </div>
          <base-table
            :pagination="pagination"
            :total="$store.state.logistics.listTotal"
            @change-pagination="changePagination"
          >
            <template #default="slotProps">
              <el-button
                link
                type="primary"
                size="small"
                style="width: 40px"
                @click="editItem(slotProps.row.id, slotProps.row.state)"
              >
                修改运单
              </el-button>
              <el-button
                link
                type="success"
                size="small"
                style="width: 40px"
                @click="viewItem(slotProps.row.id)"
              >
                详情
              </el-button>
            </template>
          </base-table>
        </el-tab-pane>
      </el-tabs>
    </section>
  </section>
</template>

<script>
import BaseForm from '../../common/base-form.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { handleDateRange } from '../../../utils/index.js';

export default {
  components: {
    BaseForm,
    ArrowDown
  },
  provide() {
    return {
      getTable: () => {
        return {
          tableFields: this.tableFields,
          tableData: this.listData
        };
      }
    };
  },
  data() {
    return {
      tableFields: [],
      listData: [],
      id: 0,
      chooseForm: {},
      activeTab: 'all',
      activeTabKey: '',
      pagination: {
        current_page: 1,
        page_size: 10
      }
    };
  },
  mounted() {
    this.chooseForm.create_time = this.lastThreeMonth();
    let column = JSON.parse(localStorage.getItem('logistics-column'));
    if (column) {
      this.tableFields = column;
    } else {
      this.tableFields = this.$global.logisticsTableFields;
    }
    this.getListData();
  },
  methods: {
    async getListData(dialog = true, transitState = '') {
      this.$store.commit('logistics/setListLoading', true);
      handleDateRange(this.chooseForm, 'shipping_time');
      handleDateRange(this.chooseForm, 'create_time');
      let params = this.chooseForm;
      params.current_page = this.pagination.current_page;
      params.page_size = this.pagination.page_size;
      params.transit_state = transitState;
      try {
        await this.$store.dispatch('logistics/getListData', { params });
        this.listData = this.$store.state.logistics.listData;
        if (dialog) {
          this.deleteDialogVisible = false;
        }
      } catch (err) {
        this.$store.commit('logistics/setListLoading', false);
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getListData(false, this.activeTabKey);
    },
    resetForm() {
      this.activeTab = 'all';
      this.pagination.current_page = 1;
      this.pagination.page_size = 10;
      this.chooseForm = {};
      this.chooseForm.create_time = this.lastThreeMonth();
      this.getListData();
    },
    handleClick(tab) {
      this.activeTabKey = this.$global.transitState.find((item) => {
        return item.name === tab.props.name;
      }).key;
      this.getListData(false, this.activeTabKey);
    },
    changePagination(val) {
      this.pagination = val;
      this.getListData(false, this.activeTabKey);
    },
    lastThreeMonth() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
};
</script>

<style scoped>
.position-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.btn-right {
  margin-right: 100px;
  margin-bottom: 20px;
}
</style>

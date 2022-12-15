<template>
  <section v-loading="$store.state.logistics.listLoading">
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
    <section class="section-border">
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
            <el-button @click="showOrderForm('create')">
              新增订单信息
            </el-button>
            <el-button @click="showOrderForm('update')">
              修改订单信息
            </el-button>
            <el-button @click="showUpdateLogisticSupplierForm">
              修改物流商
            </el-button>
            <el-button @click="handleExceptionHandling">
              异常已处理
            </el-button>
            <el-dropdown
              style="margin: 0 12px"
              @command="handleWaybillLabel"
            >
              <el-button style="width: 80px">
                标记为
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in labelList"
                    :key="item.id"
                    :command="item.id"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button @click="showDeleteWaybillDialog">
              删除
            </el-button>
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
            :table="table"
            :pagination="pagination"
            :total="$store.state.logistics.listTotal"
            @change-pagination="changePagination"
            @get-selected-ids="getSelectedIds"
            @get-deleted-id="getDeletedId"
          >
            <template #default="slotProps">
              <el-button
                link
                type="primary"
                size="small"
                style="width: 40px"
                @click="updateWaybill(slotProps.row.id)"
              >
                修改运单
              </el-button>
              <el-button
                link
                type="success"
                size="small"
                style="width: 40px"
                @click="viewWaybill(slotProps.row.id, slotProps.row.stay_time)"
              >
                详情
              </el-button>
            </template>
          </base-table>
        </el-tab-pane>
      </el-tabs>
    </section>
    <!-- 订单弹窗 -->
    <base-option
      v-model="orderFormVisible"
      :title="orderFormType === 'create' ? '新增订单信息' : '修改订单信息'"
      width="24%"
      :close-on-click-modal="false"
      @close-dialog="closeOrderForm"
    >
      <base-form
        ref="orderForm"
        :properties="
          orderFormType === 'create'
            ? $global.createOrderFields
            : $global.updateOrderFields
        "
        :base-form="orderForm"
        :inline="false"
        width="100px"
        :base-rules="$global.orderRules"
        @get-info="getOrderInfo"
      >
        <el-button @click="closeOrderForm">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitOrderForm(orderFormType)"
        >
          确定
        </el-button>
      </base-form>
    </base-option>
    <!-- 物流商弹窗 -->
    <base-option
      v-model="logisticSupplierVisible"
      title="修改物流商"
      width="24%"
      :close-on-click-modal="false"
      @close-dialog="closeLogisticSupplierForm"
    >
      <base-form
        ref="logisticSupplierForm"
        :properties="[
          {
            label: '新物流商',
            type: 'select',
            multiple: false,
            prop: 'logistic_supplier_id',
            options: [],
            option_type: 'name'
          }
        ]"
        :base-form="logisticSupplierForm"
        :inline="false"
        width="100px"
        :base-rules="{
          logistic_supplier_id: [
            {
              required: true,
              message: '请输入内容'
            }
          ]
        }"
      >
        <el-button @click="closeLogisticSupplierForm">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitLogisticSupplierForm"
        >
          确定
        </el-button>
      </base-form>
    </base-option>
    <!-- 删除确认弹窗 -->
    <base-confirm
      v-if="deleteWaybillVisible"
      :dialog-visible="deleteWaybillVisible"
      content="是否确认删除选中的运单?"
      @get-visible="closeDeleteWaybillDialog"
      @confirm-deletion="confirmDeletionWaybill"
    />
    <!-- 查看运单表单 -->
    <base-option
      v-model="viewWaybillVisible"
      width="70%"
    >
      <view-waybill
        :form="waybillDetail"
        :stay-time="stayTime"
      >
        <el-button
          type="primary"
          @click="asyncWaybillInfo"
        >
          同步
        </el-button>
      </view-waybill>
    </base-option>
  </section>
</template>

<script>
import BaseForm from '../../common/base-form.vue';
import ViewWaybill from './view-waybill.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import {
  handleDateRange,
  timeToTimestamp,
  cache
} from '../../../utils/index.js';

export default {
  components: {
    BaseForm,
    ArrowDown,
    ViewWaybill
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
      },
      orderFormVisible: false,
      orderForm: {},
      orderFormType: '',
      logisticSupplierVisible: false,
      logisticSupplierForm: {},
      selectedIds: [],
      deleteWaybillVisible: false,
      labelList: [],
      deletedId: 0,
      table: {},
      stayTime: '',
      viewWaybillVisible: false,
      waybillDetail: {},
      waybillId: 0
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
    cache,
    async getListData(transitState = '') {
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
        this.labelList = JSON.parse(cache('label'));
        this.table = {
          tableFields: this.tableFields,
          tableData: this.listData
        };
      } catch (err) {
        this.$store.commit('logistics/setListLoading', false);
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getListData(this.activeTabKey);
    },
    resetForm() {
      this.activeTab = 'all';
      this.activeTabKey = '';
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
      this.getListData(this.activeTabKey);
    },
    changePagination(val) {
      this.pagination = val;
      this.getListData(this.activeTabKey);
    },
    lastThreeMonth() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
    showOrderForm(type) {
      this.orderFormType = type;
      this.orderFormVisible = true;
    },
    submitOrderForm(type) {
      this.$refs.orderForm.$refs.form.validate((valid) => {
        if (valid) {
          if (type === 'create') {
            this.updateOrderInfo(this.orderForm, type);
          } else {
            this.updateOrderInfo(this.orderForm, type);
          }
        }
      });
    },
    async updateOrderInfo(form, type) {
      let orderParams = JSON.parse(JSON.stringify(form));
      orderParams.payment_time = timeToTimestamp(orderParams.payment_time);
      try {
        await this.$store.dispatch(`logistics/${type}Order`, orderParams);
        this.orderFormVisible = false;
        this.$refs.orderForm.$refs.form.resetFields();
      } catch (err) {
        return;
      }
    },
    closeOrderForm() {
      this.orderFormVisible = false;
      this.$refs.orderForm.$refs.form.resetFields();
    },
    async getOrderInfo(id) {
      try {
        if (id) {
          await this.$store.dispatch('logistics/getOrderDetail', {
            id
          });
          let orderDetail = this.$store.state.logistics.orderDetail;
          this.orderForm.platform_id = orderDetail.platform_id;
          this.orderForm.shop_id = orderDetail.shop_id;
          this.orderForm.payment_time = orderDetail.payment_time;
        } else {
          this.orderForm = {};
          this.$refs.orderForm.$refs.form.resetFields();
        }
      } catch (err) {
        return;
      }
    },
    closeLogisticSupplierForm() {
      this.logisticSupplierVisible = false;
      this.$refs.logisticSupplierForm.$refs.form.resetFields();
    },
    getSelectedIds(ids) {
      this.selectedIds = ids;
    },
    handleSelectedIds(fn) {
      if (this.selectedIds.length === 0) {
        this.$message.warning('请先选择要修改的运单');
      } else {
        fn();
      }
    },
    showUpdateLogisticSupplierForm() {
      this.handleSelectedIds(() => {
        this.logisticSupplierVisible = true;
      });
    },
    async updateLogisticSupplier() {
      let body = this.logisticSupplierForm;
      body.id = this.selectedIds;
      try {
        await this.$store.dispatch('logistics/updateLogisticSupplier', body);
        this.logisticSupplierVisible = false;
        this.$refs.logisticSupplierForm.$refs.form.resetFields();
        this.getListData(this.activeTabKey);
      } catch (err) {
        return;
      }
    },
    submitLogisticSupplierForm() {
      this.$refs.logisticSupplierForm.$refs.form.validate((valid) => {
        if (valid) {
          this.updateLogisticSupplier();
        }
      });
    },
    handleExceptionHandling() {
      try {
        this.handleSelectedIds(async () => {
          await this.$store.dispatch('logistics/updateExceptionHandling', {
            id: this.selectedIds
          });
          this.getListData(this.activeTabKey);
        });
      } catch (err) {
        return;
      }
    },
    showDeleteWaybillDialog() {
      this.handleSelectedIds(() => {
        this.deleteWaybillVisible = true;
      });
    },
    closeDeleteWaybillDialog() {
      this.deleteWaybillVisible = false;
    },
    async confirmDeletionWaybill() {
      try {
        await this.$store.dispatch('logistics/deleteWaybill', {
          id: this.selectedIds
        });
        this.deleteWaybillVisible = false;
        this.getListData(this.activeTabKey);
      } catch (err) {
        return;
      }
    },
    handleWaybillLabel(command) {
      try {
        this.handleSelectedIds(async () => {
          await this.$store.dispatch('logistics/updateWaybillLabel', {
            id: this.selectedIds,
            label_id: command
          });
          this.getListData(this.activeTabKey);
        });
      } catch (err) {
        return;
      }
    },
    async getDeletedId(body) {
      try {
        await this.$store.dispatch('logistics/deleteWaybillLabel', body);
        this.getListData(this.activeTabKey);
      } catch (err) {
        return;
      }
    },
    async viewWaybill(id, time, dialogFlag = true) {
      this.waybillId = id;
      try {
        await this.$store.dispatch('logistics/getWaybillDetail', {
          params: {
            id
          }
        });
        this.waybillDetail = this.$store.state.logistics.waybillDetail;
        this.stayTime = time;
        if (dialogFlag) {
          this.viewWaybillVisible = true;
        }
      } catch (err) {
        return;
      }
    },
    async asyncWaybillInfo() {
      try {
        await this.$store.dispatch('logistics/asyncWaybillInfo', {
          waybill_id: this.waybillId
        });
        this.viewWaybill(this.waybillId, this.stayTime, false);
      } catch (err) {
        return;
      }
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

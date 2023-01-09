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
          :label="
            JSON.stringify(transitState) === '{}'
              ? tag.label
              : `${tag.label}(${transitState[tag.name]})`
          "
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
            <el-dropdown
              style="margin: 0 12px"
              @command="handleImport"
            >
              <el-button
                style="width: 80px"
                type="primary"
              >
                导入
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="0">
                    导入发货运单
                  </el-dropdown-item>
                  <el-dropdown-item command="1">
                    导入退货运单
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              type="primary"
              @click="exportWaybill"
            >
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
      content="数据会全部清除，是否确认删除?"
      @get-visible="closeDeleteWaybillDialog"
      @confirm-deletion="confirmDeletionWaybill"
    />
    <!-- 修改运单弹窗 -->
    <base-option
      v-model="updateWaybillVisible"
      width="60%"
    >
      <update-waybill
        ref="updateWaybillForm"
        :form="updateWaybillForm"
        :city-option="cityOption"
        :state-option="stateOption"
        :country-option="countryOption"
        :warehouse-option="warehouseOption"
      >
        <el-button @click="closeUpdateWaybillDialog">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitUpdateWaybillForm"
        >
          确定
        </el-button>
      </update-waybill>
    </base-option>
    <!-- 查看运单弹窗 -->
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
    <!-- 导入运单弹窗 -->
    <base-option
      v-model="importWaybillVisible"
      :title="waybillType === '0' ? '导入发货运单' : '导入退货运单'"
      width="40%"
    >
      <div style="margin-bottom: 20px">
        <el-steps
          :active="$store.state.logistics.stepActive"
          align-center
        >
          <el-step title="上传Excel" />
          <el-step title="数据校验" />
        </el-steps>
      </div>
      <el-upload
        v-if="$store.state.logistics.stepActive === 1"
        drag
        action=""
        :show-file-list="false"
        :http-request="importWaybill"
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          选择Excel文件，或拖拽文件到此区域
        </div>
        <template #tip>
          <div class="el-upload__tip upload-border">
            为保证数据顺利导入，推荐您下载
            <a
              class="import-template_btn"
              @click="downloadImportTemplate"
            >导入模板</a>
          </div>
        </template>
      </el-upload>
      <div v-else>
        <div style="margin-bottom: 20px">
          该文档存在{{ error.total }}条错误数据，请修改后上传。
          <a
            style="color: #0099ff"
            target="_blank"
            href="https://alidocs.dingtalk.com/i/nodes/AY39rGpMPmeVNNO2xZ6RVOZkXKnaoNQ7"
          >
            点击可查看数据校验规则</a>
        </div>
        <el-scrollbar height="200px">
          <error-table :list="error.list" />
        </el-scrollbar>
        <div style="float: right; margin: 20px 0">
          <el-button
            type="primary"
            @click="backStep"
          >
            上一步
          </el-button>
        </div>
      </div>
    </base-option>
  </section>
</template>

<script>
import BaseForm from '../../common/base-form.vue';
import UpdateWaybill from './update-waybill.vue';
import ViewWaybill from './view-waybill.vue';
import ErrorTable from '../../common/error-table.vue';
import { ArrowDown, UploadFilled } from '@element-plus/icons-vue';
import {
  handleDateRange,
  timeToTimestamp,
  cache,
  getCountryIso3,
  defaultTime,
  checkStayTime
} from '../../../utils/index.js';
import { getState, getCity } from '../../../utils/state-city.js';

export default {
  components: {
    BaseForm,
    ErrorTable,
    ArrowDown,
    ViewWaybill,
    UploadFilled,
    UpdateWaybill
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
      updateWaybillVisible: false,
      updateWaybillForm: {},
      countryOption: [],
      stateOption: [],
      cityOption: [],
      warehouseOption: [],
      table: {},
      stayTime: '',
      viewWaybillVisible: false,
      waybillDetail: {},
      waybillId: 0,
      importWaybillVisible: false,
      waybillType: '',
      error: {},
      warehouse: [],
      transitState: this.$store.state.logistics.transitStateStatistics
    };
  },
  watch: {
    '$store.state.logistics.transitStateStatistics'(val) {
      this.transitState = val;
    }
  },
  mounted() {
    this.chooseForm.create_time = defaultTime(90);
    let column = JSON.parse(localStorage.getItem('logistics-column'));
    if (column) {
      this.tableFields = column;
    } else {
      this.tableFields = this.$global.logisticsTableFields;
    }
    this.getListData();
    this.getCountry();
  },
  methods: {
    cache,
    getDate(obj) {
      if (obj.prop === 'create_time') {
        this.chooseForm.create_time = obj.val;
        this.$store.commit('logistics/setDateChange', true);
      }
    },
    handleChoose(transitState) {
      if (!this.$store.state.logistics.isDateChange) {
        this.chooseForm.create_time = defaultTime(90);
      }
      handleDateRange(this.chooseForm, 'shipping_time');
      handleDateRange(this.chooseForm, 'create_time');
      let params = JSON.parse(JSON.stringify(this.chooseForm));
      params.current_page = this.pagination.current_page;
      params.page_size = this.pagination.page_size;
      params.transit_state = transitState;
      if (this.chooseForm.warehouse_id.length === 0) {
        params.warehouse_id = this.warehouse;
      }
      for (let i in params) {
        if (
          Array.isArray(params[i]) &&
          i !== 'create_time' &&
          i !== 'shipping_time'
        ) {
          params[i] = params[i].join(',');
        }
      }
      return params;
    },
    getWarehouse(val) {
      if (this.chooseForm.warehouse_id.length === 0) {
        this.warehouse = val;
      }
    },
    async getListData(transitState = '') {
      let params = this.handleChoose(transitState);
      if (!params.start_create_time || !params.end_create_time) {
        this.$message.warning('创建时间为必填项');
      } else {
        try {
          this.$store.commit('logistics/setListLoading', true);
          await this.$store.dispatch('logistics/getListData', { params });
          this.listData = this.$store.state.logistics.listData;
          this.table = {
            tableFields: this.tableFields,
            tableData: this.listData
          };
          this.labelList = JSON.parse(cache('label'));
        } catch (err) {
          this.$store.commit('logistics/setListLoading', false);
          return;
        }
      }
    },
    queryList() {
      let form = JSON.parse(JSON.stringify(this.chooseForm));
      let startStayTimeValid = checkStayTime(form.start_event_day);
      let endStayTimeValid = checkStayTime(form.end_event_day);
      if (startStayTimeValid && endStayTimeValid) {
        this.pagination.current_page = 1;
        this.getListData(this.activeTabKey);
      }
    },
    resetForm() {
      this.activeTab = 'all';
      this.activeTabKey = '';
      this.pagination.current_page = 1;
      this.pagination.page_size = 10;
      this.chooseForm = {
        warehouse_id: []
      };
      this.warehouse = [];
      this.chooseForm.create_time = defaultTime(90);
      this.$store.commit('logistics/setDateChange', false);
      this.getListData();
    },
    handleClick(tab) {
      this.activeTabKey = this.$global.transitState.find((item) => {
        return item.name === tab.props.name;
      }).key;
      this.pagination.current_page = 1;
      this.getListData(this.activeTabKey);
    },
    changePagination(val) {
      this.pagination = val;
      this.getListData(this.activeTabKey);
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
            params: { id }
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
    closeUpdateWaybillDialog() {
      this.updateWaybillVisible = false;
      this.$refs.updateWaybillForm.$refs.form.resetFields();
    },
    async updateWaybill(id) {
      this.waybillId = id;
      if (cache('warehouse')) {
        this.warehouseOption = JSON.parse(cache('warehouse'));
        if (cache('logistics-country')) {
          this.countryOption = JSON.parse(cache('logistics-country'));
          try {
            await this.$store.dispatch('logistics/getBaseWaybillDetail', {
              params: {
                id
              }
            });
            this.updateWaybillForm =
              this.$store.state.logistics.baseWaybillDetail;
            if (this.updateWaybillForm.country_id) {
              getState(this.updateWaybillForm.country_id).then((res) => {
                this.stateOption = res;
              });
              getCity(
                this.updateWaybillForm.country_id,
                this.updateWaybillForm.state_id
              ).then((res) => {
                this.cityOption = res;
              });
            }
            this.updateWaybillVisible = true;
          } catch (err) {
            return;
          }
        }
      } else {
        this.$message.warning('请刷新后再尝试！');
      }
    },
    checkPostcode() {
      let reg = getCountryIso3(this.updateWaybillForm, this.countryOption);
      if (!reg.test(this.updateWaybillForm.postcode)) {
        this.$message.error('输入的邮编与选定的客户国家不匹配，请检查');
      } else {
        this.updateWaybillInfo();
      }
    },
    submitUpdateWaybillForm() {
      this.$refs.updateWaybillForm.$refs.form.validate((valid) => {
        if (valid) {
          this.checkPostcode();
        }
      });
    },
    async updateWaybillInfo() {
      let body = JSON.parse(JSON.stringify(this.updateWaybillForm));
      body.id = this.waybillId;
      try {
        await this.$store.dispatch('logistics/updateWaybill', body);
        this.updateWaybillVisible = false;
        this.getListData(this.activeTabKey);
      } catch (err) {
        return;
      }
    },
    async getCountry() {
      if (!cache('logistics-country')) {
        try {
          await this.$store.dispatch('getCountry');
        } catch (err) {
          return;
        }
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
        this.getListData(this.activeTabKey);
      } catch (err) {
        return;
      }
    },
    handleImport(type) {
      this.$store.commit('logistics/setStepActive', 1);
      this.waybillType = type;
      this.importWaybillVisible = true;
    },
    async downloadImportTemplate() {
      try {
        await this.$store.dispatch('logistics/exportTemplate');
      } catch (err) {
        return;
      }
    },
    async importWaybill(e) {
      let file = e.file;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', this.waybillType);
      try {
        await this.$store.dispatch('logistics/importWaybill', formData);
        this.error = this.$store.state.logistics.error;
        if (JSON.stringify(this.error) === '{}') {
          this.importWaybillVisible = false;
          this.getListData(this.activeTabKey);
        }
      } catch (err) {
        return;
      }
    },
    backStep() {
      this.$store.commit('logistics/setStepActive', 1);
    },
    async exportWaybill() {
      let body = this.handleChoose(this.activeTabKey);
      try {
        await this.$store.dispatch('logistics/exportWaybill', body);
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

.import-template_btn {
  color: #0099ff;
  cursor: pointer;
}

.upload-border {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>

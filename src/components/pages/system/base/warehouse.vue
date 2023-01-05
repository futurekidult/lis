<template>
  <div>
    <section class="section-border">
      <div class="select-title">
        <el-divider direction="vertical" /> 筛选条件
      </div>
      <base-form
        :properties="$global.warehouseChooseOptions"
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
      <div class="flex-between">
        <div class="select-title">
          <el-divider direction="vertical" /> 仓库列表
        </div>
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="showWarehouseDialog('create')"
        >
          新增
        </el-button>
      </div>

      <base-table
        style="margin-top: 20px"
        :table="table"
        :pagination="pagination"
        :total="total"
        :icon-visible="false"
        :selection-visible="false"
        @change-pagination="changePagination"
      >
        <template #default="slotProps">
          <el-button
            link
            type="primary"
            size="small"
            style="width: 40px; margin-left: 20px"
            @click="
              showWarehouseDialog(
                'update',
                slotProps.row.id,
                slotProps.row.warehouse_area_id,
                slotProps.row.oversea_location_id,
                slotProps.row.warehouse_name
              )
            "
          >
            修改
          </el-button>
        </template>
      </base-table>
      <!-- 仓库弹窗 -->
      <base-option
        v-if="warehouseVisible"
        v-model="warehouseVisible"
        :title="warehouseType === 'create' ? '新增仓库' : '修改仓库'"
        width="25%"
        @close-dialog="closeWarehouse"
      >
        <base-form
          ref="warehouseForm"
          :properties="$global.warehouseChooseOptions"
          :base-form="form"
          :base-rules="formRules"
          :inline="false"
          width="130px"
        >
          <el-button @click="closeWarehouse">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitWarehouse"
          >
            确定
          </el-button>
        </base-form>
      </base-option>
    </section>
  </div>
</template>

<script>
import BaseOption from '../../../common/base-option-dialog.vue';

export default {
  components: {
    BaseOption
  },
  data() {
    return {
      table: {},
      pagination: {
        current_page: 1,
        page_size: 10
      },
      total: 0,
      form: {},
      warehouseId: 0,
      warehouseType: '',
      warehouseVisible: false,
      formRules: {
        oversea_location_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        warehouse_area_id: [
          {
            required: true,
            message: '请选择'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入'
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
            message: '只允许中英文，数字，下划线，中划线'
          },
          {
            min: 1,
            max: 20,
            message: '最多只允许输入20位'
          }
        ]
      },
      chooseForm: {}
    };
  },
  mounted() {
    this.getWarehouse();
  },
  methods: {
    async getWarehouse() {
      let params = this.chooseForm;
      params.current_page = this.pagination.current_page;
      params.page_size = this.pagination.page_size;
      //由于公共base-form,故删除多余的参数
      delete params.end_shipping_time;
      delete params.start_shipping_time;
      delete params.year;
      try {
        await this.$store.dispatch('system/base/getWarehouse', {
          params
        });
        let warehouse = this.$store.state.system.base;
        this.table = {
          tableData: warehouse.warehouse,
          tableFields: this.$global.warehouseTableFields
        };
        this.total = warehouse.warehouseLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getWarehouse();
    },
    resetForm() {
      this.pagination.current_page = 1;
      this.pagination.page_size = 10;
      this.chooseForm = {};
      this.getWarehouse();
    },
    changePagination(val) {
      this.pagination = val;
      this.getWarehouse();
    },
    showWarehouseDialog(
      type,
      id,
      warehouse_area_id,
      oversea_location_id,
      name
    ) {
      this.warehouseType = type;
      if (type === 'update') {
        this.warehouseId = id;
        this.form.warehouse_area_id = warehouse_area_id;
        this.form.oversea_location_id = oversea_location_id;
        this.form.name = name;
        this.$global.warehouseChooseOptions[0].disabled = true;
        this.$global.warehouseChooseOptions[1].disabled = true;
      } else {
        this.form = {};
        this.$global.warehouseChooseOptions[0].disabled = false;
        this.$global.warehouseChooseOptions[1].disabled = false;
      }
      this.warehouseVisible = true;
    },
    closeWarehouse() {
      this.warehouseVisible = false;
      this.$refs.warehouseForm.$refs.form.resetFields();
    },
    async createWarehouse() {
      try {
        await this.$store.dispatch('system/base/createWarehouse', this.form);
        this.warehouseVisible = false;
        this.$refs.warehouseForm.$refs.form.resetFields();
        this.pagination.current_page = 1;
        this.getWarehouse();
      } catch (err) {
        return;
      }
    },
    async updateWarehouse() {
      let body = this.form;
      body.id = this.warehouseId;
      try {
        await this.$store.dispatch('system/base/updateWarehouse', body);
        this.warehouseVisible = false;
        this.$refs.warehouseForm.$refs.form.resetFields();
        this.getWarehouse();
      } catch (err) {
        return;
      }
    },
    async submitWarehouse() {
      this.$refs.warehouseForm.$refs.form.validate((valid) => {
        if (valid) {
          if (this.warehouseType === 'create') {
            this.createWarehouse();
          } else {
            this.updateWarehouse();
          }
        }
      });
    }
  }
};
</script>

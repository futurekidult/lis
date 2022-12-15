<template>
  <section>
    <el-scrollbar height="700px">
      <el-form
        label-width="auto"
        :model="waybillForm"
        class="waybill-form"
        style="width: 99%"
      >
        <h2>运单信息</h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="运单号">
              <el-input
                v-model="waybillForm.waybill_no"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮编">
              <el-input
                v-model="waybillForm.postcode"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库">
              <el-input
                v-model="waybillForm.warehouse"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="SKU">
              <el-input
                v-model="waybillForm.sku"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货时间">
              <el-date-picker
                v-model="waybillForm.shipping_time"
                type="datetime"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户国家">
              <el-input
                v-model="waybillForm.country"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户州">
              <div class="state-city_container">
                <el-input
                  v-model="waybillForm.state"
                  disabled
                />
                <el-input
                  v-model="waybillForm.origin_state"
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户城市">
              <div class="state-city_container">
                <el-input
                  v-model="waybillForm.city"
                  disabled
                />
                <el-input
                  v-model="waybillForm.origin_city"
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户地址">
              <el-input
                v-model="waybillForm.address"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户姓名">
              <el-input
                v-model="waybillForm.name"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户电话">
              <el-input
                v-model="waybillForm.phone"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户邮箱">
              <el-input
                v-model="waybillForm.email"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注信息">
          <el-input
            v-model="waybillForm.remark"
            type="textarea"
            :rows="6"
            disabled
            size="small"
          />
        </el-form-item>
        <el-divider />
        <h2>订单信息</h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单号">
              <el-input
                v-model="waybillForm.order_no"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="平台">
              <el-input
                v-model="waybillForm.platform"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="店铺">
              <el-input
                v-model="waybillForm.shop"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="支付时间">
          <el-date-picker
            v-model="waybillForm.payment_time"
            type="datetime"
            disabled
          />
        </el-form-item>
        <el-divider />
        <h2>物流基本信息</h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="物流商">
              <el-input
                v-model="waybillForm.logistic_supplier"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流商官网链接">
              <el-input
                v-model="waybillForm.logistic_supplier_homepage"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计送达时间">
              <el-date-picker
                v-model="waybillForm.estimated_delivery_time"
                type="datetime"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="首枪时间">
              <el-date-picker
                v-model="waybillForm.receipt_time"
                type="datetime"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="首枪时效">
              <el-input
                v-model="waybillForm.receipt_days"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送达时间">
              <el-date-picker
                v-model="waybillForm.delivery_time"
                type="datetime"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="送达时效">
          <el-input
            v-model="waybillForm.delivery_days"
            disabled
          />
        </el-form-item>
        <el-divider />
        <h2>当前物流信息</h2>
        <el-row>
          <el-col :span="8">
            <el-form-item label="获取状态">
              <el-input
                v-model="waybillForm.sync_state_desc"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="获取时间">
              <el-date-picker
                v-model="waybillForm.sync_time"
                type="datetime"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运输状态">
              <el-input
                v-model="waybillForm.transit_state_desc"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="运输子状态">
              <el-input
                v-model="waybillForm.transit_sub_state_desc"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最新轨迹停留时长">
              <el-input
                v-model="time"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最新轨迹时间">
              <el-date-picker
                v-model="waybillForm.current_event_time"
                type="datetime"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="最新轨迹地址">
              <el-input
                v-model="waybillForm.current_event_address"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="最新轨迹详情">
              <el-input
                v-model="waybillForm.current_event_detail"
                disabled
                style="min-width: 600px !important"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <h2>物流轨迹信息</h2>
        <base-table
          :icon-visible="false"
          :index-visible="true"
          :selection-visible="false"
          :pagination-visible="false"
          :operation-visible="false"
          :table="table"
          type="tracking"
        />
        <el-form-item class="btn-position">
          <slot />
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </section>
</template>

<script>
import BaseTable from '../../common/base-table.vue';

export default {
  components: {
    BaseTable
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    stayTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      waybillForm: this.form,
      time: this.stayTime
    };
  },
  computed: {
    table() {
      let tableData = this.form.logistic_tracking;
      let tableFields = [
        {
          label: '轨迹时间',
          prop: 'event_time',
          width: '100px',
          show: true
        },
        {
          label: '轨迹地址',
          prop: 'event_address',
          show: true
        },
        {
          label: '轨迹详情',
          prop: 'event_detail',
          width: '400px',
          show: true
        },
        {
          label: '运输子状态',
          prop: 'transit_sub_state',
          show: true
        }
      ];
      return {
        tableData,
        tableFields
      };
    }
  }
};
</script>

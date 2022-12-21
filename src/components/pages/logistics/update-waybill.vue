<template>
  <section>
    <h2>运单信息</h2>
    <el-form
      ref="form"
      label-width="auto"
      :model="waybillForm"
      class="waybill-form"
      :rules="waybillRules"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="运单号"
            prop="waybill_no"
          >
            <el-input
              v-model="waybillForm.waybill_no"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="订单号"
            prop="order_no"
          >
            <el-select
              v-model="waybillForm.order_no"
              clearable
              filterable
              remote
              reserve-keyword
              :loading="orderLoading"
              :remote-method="(str) => remoteMethod(str, 'order_id')"
              @change="(val) => changeId(val, 'order_id')"
            >
              <el-option
                v-for="option in orderOption"
                :key="option.id"
                :label="option.order_no"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="邮编"
            prop="postcode"
          >
            <el-input
              v-model="waybillForm.postcode"
              clearable
              @change="checkPostcodeValid"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="仓库"
            prop="warehouse_id"
          >
            <el-select
              v-model="waybillForm.warehouse_id"
              filterable
              clearable
            >
              <el-option
                v-for="item in warehouse"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="SKU"
            prop="sku"
          >
            <el-select
              v-model="waybillForm.sku"
              clearable
              filterable
              remote
              reserve-keyword
              :loading="skuLoading"
              :remote-method="(str) => remoteMethod(str, 'sku_id')"
              @change="(val) => changeId(val, 'sku_id')"
            >
              <el-option
                v-for="option in skuOption"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="发货时间"
            prop="shipping_time"
          >
            <el-date-picker
              v-model="waybillForm.shipping_time"
              clearable
              type="datetime"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="客户国家"
            prop="country_id"
          >
            <el-select
              v-model="waybillForm.country_id"
              filterable
              clearable
              placeholder=""
              @clear="clearCountry"
              @change="changeCountry"
            >
              <el-option
                v-for="item in country"
                :key="item.id"
                :label="
                  item.name_cn ? `${item.origin}(${item.name_cn})` : item.origin
                "
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="客户州"
            prop="state"
          >
            <div class="state-city_container">
              <el-select
                v-model="waybillForm.state_id"
                filterable
                clearable
                placeholder=""
                @clear="clearState"
                @change="getCity(waybillForm.country_id, waybillForm.state_id)"
              >
                <el-option
                  v-for="item in state"
                  :key="item.id"
                  :label="
                    item.name_cn
                      ? `${item.origin}(${item.name_cn})`
                      : item.origin
                  "
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
              <el-input
                v-model="waybillForm.origin_state"
                disabled
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="客户城市"
            prop="city"
          >
            <div class="state-city_container">
              <el-select
                v-model="waybillForm.city_id"
                filterable
                clearable
                placeholder=""
              >
                <el-option
                  v-for="item in city"
                  :key="item.id"
                  :label="
                    item.name_cn
                      ? `${item.origin}(${item.name_cn})`
                      : item.origin
                  "
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
              <el-input
                v-model="waybillForm.origin_city"
                disabled
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="客户地址"
            prop="address"
          >
            <el-input
              v-model="waybillForm.address"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="客户姓名"
            prop="name"
          >
            <el-input
              v-model="waybillForm.name"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="客户电话"
            prop="phone"
          >
            <el-input
              v-model="waybillForm.phone"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="客户邮箱"
        prop="email"
      >
        <el-input
          v-model="waybillForm.email"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input
          v-model="waybillForm.remark"
          type="textarea"
          :rows="6"
          clearable
        />
      </el-form-item>
      <el-form-item class="btn-position">
        <slot />
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { getState, getCity } from '../../../utils/state-city.js';
import { getCountryIso3 } from '../../../utils/index.js';
export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    countryOption: {
      type: Array,
      default: null
    },
    stateOption: {
      type: Array,
      default: null
    },
    cityOption: {
      type: Array,
      default: null
    },
    warehouseOption: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      skuOption: [],
      orderOption: [],
      skuLoading: false,
      orderLoading: false,
      city: this.cityOption,
      state: this.stateOption,
      waybillForm: this.form,
      country: this.countryOption,
      warehouse: this.warehouseOption,
      waybillRules: {
        waybill_no: [
          {
            required: true,
            message: '请输入'
          }
        ],
        order_no: [
          {
            required: true,
            message: '请输入订单号'
          }
        ],
        postcode: [
          {
            required: true,
            message: '请输入'
          },
          {
            min: 1,
            max: 20,
            message: '最多只允许输入20位'
          }
        ],
        warehouse_id: [
          {
            required: true,
            message: '请选择仓库'
          }
        ],
        sku: [
          {
            required: true,
            message: '请输入SKU'
          }
        ],
        shipping_time: [
          {
            required: true,
            message: '请选择发货时间'
          }
        ],
        country_id: [
          {
            required: true,
            message: '请选择客户国家'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入客户地址'
          },
          {
            pattern: /^[A-Za-z0-9- .&%#,()\/]+$/,
            message:
              '只允许输入英文、数字、中划线、空格、点、/、& 、%、#、英文逗号、()英文括号'
          },
          {
            min: 1,
            max: 50,
            message: '最多只允许输入50位'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入客户姓名'
          },
          {
            pattern: /^[A-Za-z0-9- .&%#,()\/]+$/,
            message:
              '只允许输入英文、数字、中划线、空格、点、/、& 、%、#、英文逗号、()英文括号'
          },
          {
            min: 1,
            max: 30,
            message: '最多只允许输入30位'
          }
        ],
        phone: [
          {
            required: false
          },
          {
            pattern: /^[A-Za-z0-9-.+ ]+$/,
            message: '只允许输入数字、英文、＋、空格、中划线、点'
          },
          {
            min: 1,
            max: 30,
            message: '最多只允许输入30位'
          }
        ],
        email: [
          {
            required: false
          },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '输入的邮箱不合法'
          }
        ],
        remark: [
          {
            required: false
          },
          {
            min: 1,
            max: 100,
            message: '最多只允许输入100位'
          }
        ]
      }
    };
  },
  watch: {
    form(val) {
      this.waybillForm = val;
    },
    countryOption(val) {
      this.country = val;
    },
    stateOption(val) {
      this.state = val;
    },
    cityOption(val) {
      this.city = val;
    },
    warehouseOption(val) {
      this.warehouse = val;
    },
    'form.country_id'() {
      this.checkPostcode(this.waybillForm.postcode);
    }
  },
  methods: {
    checkPostcodeValid(val) {
      if (val) {
        this.checkPostcode(val);
      }
    },
    checkPostcode(postcode) {
      let reg = getCountryIso3(this.waybillForm, this.country);
      if (!reg.test(postcode)) {
        this.$message.error('输入的邮编与选定的客户国家不匹配，请检查');
      }
    },
    async remoteMethod(query, prop) {
      if (query) {
        try {
          if (prop === 'sku_id') {
            this.skuLoading = true;
            await this.$store.dispatch('getSku', {
              params: {
                name: query
              }
            });
            this.skuOption = this.$store.state.sku;
            this.skuLoading = false;
          } else {
            this.orderLoading = true;
            await this.$store.dispatch('getOrder', {
              params: {
                order_no: query
              }
            });
            this.orderOption = this.$store.state.order;
            this.orderLoading = false;
          }
        } catch (err) {
          return;
        }
      } else {
        if (prop === 'sku_id') {
          this.skuOption = [];
        } else {
          this.orderOption = [];
        }
      }
    },
    async changeId(val, prop) {
      this.waybillForm[prop] = val;
    },
    clearCountry() {
      this.waybillForm.state_id = 0;
      this.waybillForm.city_id = 0;
    },
    clearState() {
      this.waybillForm.city_id = 0;
    },
    async changeCountry(country) {
      this.clearCountry();
      getState(country).then((res) => {
        this.state = res;
      });
    },
    async getCity(country, state) {
      this.clearState();
      getCity(country, state).then((res) => {
        this.city = res;
      });
    }
  }
};
</script>

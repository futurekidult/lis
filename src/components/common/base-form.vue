<template>
  <el-form
    ref="form"
    :inline="inline"
    :model="form"
    :rules="baseRules"
  >
    <el-form-item
      v-for="(item, index) in properties"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      :label-width="item.label === '最新轨迹停留时长(天)' ? '150px' : width"
    >
      <el-input
        v-if="
          item.type === 'input' && !item.range && item.prop !== 'waybill_no'
        "
        v-model="form[item.prop]"
        placeholder="请输入内容"
        clearable
      />
      <el-input
        v-if="item.type === 'input' && item.prop === 'waybill_no'"
        v-model="form[item.prop]"
        placeholder="请输入内容"
        clearable
        style="width: 242px !important"
      >
        <template #append>
          <el-icon
            class="el-icon-search search-btn"
            @click="searchWaybillNo(1, item.prop)"
          >
            <Search />
          </el-icon>
          <el-popover
            :width="400"
            :visible="popoverVisible"
          >
            <template #reference>
              <el-icon
                class="search-btn"
                :color="operationIconColor"
                @click="changePopoverState(true, '#409eff')"
              >
                <Operation />
              </el-icon>
            </template>
            <template #default>
              <el-input
                v-model="form['multiple_waybill_no']"
                placeholder="请输入内容"
                type="textarea"
                :rows="10"
              />
              <el-divider />
              <div class="flex-between">
                <el-button
                  size="small"
                  @click="clearMultipleWaybillNo"
                >
                  清空
                </el-button>
                <div>
                  <el-button
                    size="small"
                    @click="changePopoverState(false, 'inherit')"
                  >
                    关闭
                  </el-button>
                  <el-button
                    size="small"
                    @click="searchWaybillNo(2, 'multiple_waybill_no')"
                  >
                    搜索
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
        </template>
      </el-input>
      <el-select
        v-if="(item.type === 'select' || item.type === 'remote') && !item.range"
        v-model="form[item.prop]"
        clearable
        filterable
        :placeholder="item.placeholder ? item.placeholder : '请选择'"
        :remote="item.type === 'remote'"
        :reserve-keyword="item.type === 'remote'"
        :loading="item.type === 'remote' ? remoteLoading : false"
        :multiple="item.multiple"
        :collapse-tags="item.multiple"
        :collapse-tags-tooltip="item.multiple"
        :remote-method="(str) => remoteMethod(str, item.prop, item.type)"
        :style="
          item.prop === 'shipping_time_unit' || item.prop === 'year'
            ? 'width: 90px !important'
            : ''
        "
        :disabled="disabled(item.prop, item.disabled)"
        @change="
          (val) => getRelatedInfo(val, item.multiple, item.prop, item.type)
        "
      >
        <div v-loading="optionLoading">
          <div v-if="item.option_type === 'name'">
            <el-option
              v-for="option in item.options"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </div>
          <div v-else-if="item.option_type === 'other'">
            <el-option
              v-for="option in item.options"
              :key="option.key"
              :label="option.value"
              :value="option.key"
            />
          </div>
          <div v-else>
            <el-option
              v-for="option in item.options"
              :key="option.id"
              :label="option.order_no"
              :value="option.id"
            />
          </div>
        </div>
      </el-select>
      <el-date-picker
        v-if="item.type === 'single-date' && !item.range"
        v-model="form[item.prop]"
        type="datetime"
        placeholder="请选择支付时间"
      />
      <el-date-picker
        v-if="item.type === 'date' && !item.range"
        v-model="form[item.prop]"
        type="daterange"
        start-placeholder="年-月-日"
        end-placeholder="年-月-日"
        @change="(val) => changeDate(val, item.prop)"
      />
      <el-input
        v-if="item.type === 'textarea' && !item.range"
        v-model="form[item.prop]"
        type="textarea"
        placeholder="请输入内容"
        clearable
      />
      <div
        v-if="item.range"
        style="display: flex; width: 220px"
      >
        <el-col :span="10">
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop1]"
            placeholder="请输入"
            style="width: 90px !important"
            @input="checkStayTime(form[item.prop1])"
          />
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop1]"
            placeholder="请选择"
            clearable
            style="width: 90px !important"
          >
            <div v-if="form.shipping_time_unit !== 'y'">
              <el-option
                v-for="i in option"
                :key="i"
                :label="i"
                :value="i"
              />
            </div>
            <div v-else>
              <el-option
                v-for="i in option"
                :key="i.key"
                :label="i.value"
                :value="i.key"
              />
            </div>
          </el-select>
        </el-col>
        <el-col
          :span="4"
          style="text-align: center"
        >
          <span>至</span>
        </el-col>
        <el-col :span="10">
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop2]"
            placeholder="请输入"
            style="width: 90px !important"
            @input="checkStayTime(form[item.prop2])"
          />
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop2]"
            placeholder="请选择"
            clearable
            style="width: 90px !important"
          >
            <div v-if="form.shipping_time_unit !== 'y'">
              <el-option
                v-for="i in option"
                :key="i"
                :label="i"
                :value="i"
              />
            </div>
            <div v-else>
              <el-option
                v-for="i in option"
                :key="i.value"
                :label="i.value"
                :value="i.value"
              />
            </div>
          </el-select>
        </el-col>
      </div>
    </el-form-item>

    <el-form-item class="btn-position">
      <slot />
    </el-form-item>
  </el-form>
</template>

<script>
import {
  cache,
  setYearOption,
  getWeek,
  checkStayTime
} from '../../utils/index.js';
import { Search, Operation } from '@element-plus/icons-vue';

export default {
  components: {
    Search,
    Operation
  },
  props: {
    properties: {
      type: Array,
      default: null
    },
    baseForm: {
      type: Object,
      default: null
    },
    inline: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    baseRules: {
      type: Object,
      default: null
    }
  },
  emits: ['get-info', 'get-warehouse', 'get-date', 'search-waybill-no'],
  data() {
    return {
      timeout: null,
      form: this.baseForm,
      optionLoading: false,
      remoteLoading: true,
      warehouse: [],
      option: null,
      date: new Date(),
      showYear: false,
      popoverVisible: false,
      operationIconColor: 'inherit'
    };
  },
  watch: {
    baseForm(val) {
      this.form = val;
    },
    'form.shipping_time_unit': {
      handler(val) {
        this.option = [];
        if (val === 'w') {
          this.form.year = this.date.getFullYear();
          this.getWeek();
          this.showYear = false;
        } else if (val === 'y') {
          this.option = setYearOption();
          this.getCurrentYear();
          this.showYear = true;
        } else {
          this.option = 12;
          this.form.year = this.date.getFullYear();
          this.getCurrentMonth();
          this.showYear = false;
        }
      },
      immediate: true,
      deep: true
    },
    'form.waybill_no': {
      handler(val) {
        if (val) {
          this.form.multiple_waybill_no = '';
        }
      },
      immediate: true,
      deep: true
    },
    'form.multiple_waybill_no': {
      handler(val) {
        if (val) {
          this.form.waybill_no = '';
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.properties.forEach((item) => {
      if (item.type === 'select' && item.prop !== 'shipping_time_unit') {
        this.getOption(item.prop);
      }
      if (item.prop === 'shipping_time_unit') {
        this.form.shipping_time_unit = 'w';
        this.getWeek();
      }
    });
  },
  methods: {
    checkStayTime,
    async getWeek() {
      getWeek(this.form.year).then((res) => {
        if (res) {
          this.option = res.week_num;
          this.form.start_shipping_time = res.current_week;
          this.form.end_shipping_time = res.current_week;
        }
      });
    },
    getCurrentMonth() {
      let month = this.date.getMonth() + 1;
      this.form.start_shipping_time = month;
      this.form.end_shipping_time = month;
    },
    getCurrentYear() {
      let year = this.date.getFullYear();
      this.form.start_shipping_time = year;
      this.form.end_shipping_time = year;
      this.form.year = '';
    },
    getOptionObj(prop) {
      return this.properties.find((item) => {
        return item.prop === prop;
      });
    },
    async getOption(prop) {
      this.optionLoading = true;
      let selectObj = this.getOptionObj(prop);
      try {
        if (
          prop !== 'exception_handling' &&
          prop !== 'parcel_type' &&
          prop !== 'year'
        ) {
          let newProp = prop.replace('_id', '');
          let arr = [];
          arr = newProp.split('_');
          // 将获取到的属性的首字母大写
          for (let i = 0; i < arr.length; i++) {
            arr[i] =
              arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1).toLowerCase();
          }
          if (!cache(newProp)) {
            await this.$store.dispatch(`get${arr.join('')}`);
          }
          selectObj.options = JSON.parse(cache(newProp));
        } else if (prop !== 'year') {
          if (!cache(prop)) {
            await this.$store.dispatch('getSystemParameter');
          }
          selectObj.options = JSON.parse(cache(prop));
        } else {
          selectObj.options = setYearOption();
        }
        this.optionLoading = false;
      } catch (err) {
        this.optionLoading = false;
        return;
      }
    },
    async getSkuOrOrderOption(label, str, query, prop, fn) {
      let selectObj = this.getOptionObj(prop);
      selectObj.options = [];
      try {
        await this.$store.dispatch(fn, {
          params: {
            [label]: query
          }
        });
        selectObj.options = this.$store.state[str];
        this.remoteLoading = false;
      } catch (err) {
        return;
      }
    },
    remoteMethod(query, prop, type) {
      if (type === 'remote') {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (query) {
            this.remoteLoading = true;
            try {
              if (prop === 'sku_id') {
                this.getSkuOrOrderOption('name', 'sku', query, prop, 'getSku');
              } else {
                this.getSkuOrOrderOption(
                  'order_no',
                  'order',
                  query,
                  prop,
                  'getOrder'
                );
              }
            } catch (err) {
              return;
            }
          } else {
            let selectObj = this.getOptionObj(prop);
            selectObj.options = [];
          }
        }, 500);
      }
    },
    async getRelatedInfo(id, flag, prop, type) {
      if (prop === 'warehouse_area_id' || prop === 'oversea_location_id') {
        try {
          let params = {
            oversea_location_id: this.form.oversea_location_id.join(','),
            warehouse_area_id: this.form.warehouse_area_id.join(',')
          };
          await this.$store.dispatch('getWarehouse', { params });
          let selectObj = this.getOptionObj('warehouse_id');
          selectObj.options = this.$store.state.warehouse;
          if (this.form.warehouse_id.length === 0) {
            this.warehouse = selectObj.options.map((item) => {
              return item.id;
            });
            if (
              this.form.warehouse_area_id.length === 0 &&
              this.form.oversea_location_id.length === 0
            ) {
              this.warehouse = [];
            }
            this.$emit('get-warehouse', this.warehouse);
          }
        } catch (err) {
          return;
        }
      } else if (type === 'remote') {
        if (!flag) {
          this.$emit('get-info', id);
        }
      } else if (prop === 'year') {
        switch (this.form.shipping_time_unit) {
          case 'w':
            this.getWeek();
            break;
          case 'm':
            this.getCurrentMonth();
            break;
          default:
        }
      }
    },
    changeDate(val, prop) {
      this.$emit('get-date', {
        val,
        prop
      });
    },
    disabled(prop, disabled) {
      if (
        (prop === 'year' && this.showYear) ||
        (prop === 'oversea_location_id' && disabled) ||
        (prop === 'warehouse_area_id' && disabled)
      ) {
        return true;
      }
    },
    searchWaybillNo(type, prop) {
      this.$emit('search-waybill-no', {
        [prop]: this.form[prop],
        waybill_no_query_type: type
      });
    },
    clearMultipleWaybillNo() {
      this.form.multiple_waybill_no = '';
    },
    changePopoverState(visible, color) {
      this.popoverVisible = visible;
      this.operationIconColor = color;
    }
  }
};
</script>

<style scoped>
.search-btn {
  cursor: pointer;
}

.el-icon-search {
  margin: 0 5px;
}

.search-btn:hover,
.search-btn:focus {
  color: #409eff;
}

.el-input-group >>> .el-input-group__append {
  background-color: #ffffff00 !important;
  padding: 0 8px 0 0px;
}

.el-input-group >>> .el-input__wrapper {
  box-shadow: 0 1px 0 0 var(--el-input-border-color) inset,
    0 -1px 0 0 var(--el-input-border-color) inset,
    0px 0 1px 0 var(--el-input-border-color) inset,
    1px 0px 0px 0px var(--el-input-border-color) inset;
}
</style>

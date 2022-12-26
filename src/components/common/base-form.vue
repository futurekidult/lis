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
        v-if="item.type === 'input' && !item.range"
        v-model="form[item.prop]"
        placeholder="请输入"
        clearable
      />
      <el-select
        v-if="item.type === 'remote' && !item.range"
        ref="select"
        v-model="form[item.prop]"
        multiple
        filterable
        remote
        reserve-keyword
        collapse-tags
        collapse-tags-tooltip
        placeholder="请输入"
        :remote-method="(str) => remoteMethod(str, item.prop)"
        :loading="remoteLoading"
      >
        <div v-if="item.prop === 'order_id'">
          <el-option
            v-for="option in item.options"
            :key="option.id"
            :label="option.order_no"
            :value="option.id"
          />
        </div>
        <div v-else>
          <el-option
            v-for="option in item.options"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          />
        </div>
      </el-select>
      <el-select
        v-if="item.type === 'select' && !item.range"
        v-model="form[item.prop]"
        clearable
        filterable
        placeholder="请选择"
        style="width: 100%"
        :multiple="item.multiple"
        :collapse-tags="item.multiple"
        :collapse-tags-tooltip="item.multiple"
        @change="getWarehouseOption(item.prop)"
      >
        <div v-loading="optionLoading">
          <div v-if="item.option_type === 'normal'">
            <el-option
              v-for="option in item.options"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </div>
          <div v-else>
            <el-option
              v-for="option in item.options"
              :key="option.key"
              :label="option.value"
              :value="option.key"
            />
          </div>
        </div>
      </el-select>
      <el-date-picker
        v-if="item.type === 'date' && !item.range"
        v-model="form[item.prop]"
        type="daterange"
        start-placeholder="年-月-日"
        end-placeholder="年-月-日"
      />
      <el-input
        v-if="item.type === 'textarea' && !item.range"
        v-model="form[item.prop]"
        type="textarea"
        placeholder="请输入"
        clearable
      />
      <div
        v-if="item.range"
        style="display: flex; width: 220px"
      >
        <el-col :span="8">
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop1]"
            placeholder="请输入"
            clearable
          />
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop1]"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-col>
        <el-col
          :span="2"
          style="text-align: center"
        >
          <span>至</span>
        </el-col>
        <el-col :span="8">
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop2]"
            placeholder="请输入"
            clearable
            style="width: 100%"
          />
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop2]"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
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
import { cache } from '../../utils/index.js';

export default {
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
  data() {
    return {
      timeout: null,
      form: this.baseForm,
      optionLoading: true,
      remoteLoading: false
    };
  },
  watch: {
    baseForm(val) {
      this.form = val;
    }
  },
  mounted() {
    this.properties.forEach((item) => {
      if (item.type === 'select') {
        this.getOption(item.prop);
      }
    });
  },
  methods: {
    getOptionObj(prop) {
      return this.$global.logisticsChooseOptions.find((item) => {
        return item.prop === prop;
      });
    },
    async getOption(prop) {
      this.optionLoading = true;
      let selectObj = this.getOptionObj(prop);
      try {
        if (prop !== 'exception_handling' && prop !== 'parcel_type') {
          let newProp = prop.replace('_id', '');
          let arr = [];
          if (newProp !== 'warehouse') {
            arr = newProp.split('_');
            // 将获取到的属性的首字母大写
            for (let i = 0; i < arr.length; i++) {
              arr[i] =
                arr[i].slice(0, 1).toUpperCase() +
                arr[i].slice(1).toLowerCase();
            }
            if (!cache(newProp)) {
              await this.$store.dispatch(`get${arr.join('')}`);
            }
            selectObj.options = JSON.parse(cache(newProp));
          }
        } else {
          if (!cache(prop)) {
            await this.$store.dispatch('getSystemParameter');
          }
          selectObj.options = JSON.parse(cache(prop));
        }
        this.optionLoading = false;
      } catch (err) {
        this.optionLoading = false;
        return;
      }
    },
    async getWarehouseOption(prop) {
      if (prop === 'warehouse_area_id' || prop === 'oversea_location_id') {
        try {
          let params = {
            oversea_location_id: this.form.oversea_location_id.join(','),
            warehouse_area_id: this.form.warehouse_area_id.join(',')
          };
          await this.$store.dispatch('getWarehouse', { params });
          let selectObj = this.getOptionObj('warehouse_id');
          selectObj.options = this.$store.state.warehouse;
        } catch (err) {
          return;
        }
      }
    },
    async getSkuOrOrderOption(label, str, query, prop, fn) {
      let selectObj = this.getOptionObj(prop);
      selectObj.options = [];
      await this.$store.dispatch(fn, {
        params: {
          [label]: query
        }
      });
      selectObj.options = this.$store.state[str];
      this.remoteLoading = false;
    },
    remoteMethod(query, prop) {
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
      });
    }
  }
};
</script>

<style scoped>
.btn-position {
  float: right;
}
</style>

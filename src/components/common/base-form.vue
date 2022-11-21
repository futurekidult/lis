<template>
  <el-form
    ref="form"
    :inline="inline"
    :model="form"
    :label-width="width"
    :rules="baseRules"
    size="small"
  >
    <el-form-item
      v-for="(item, index) in properties"
      :key="index"
      :label="item.label"
      :prop="item.prop"
    >
      <el-input
        v-if="item.type === 'input' && !item.range"
        v-model="form[item.prop]"
        placeholder="enter a value"
        clearable
      />
      <el-select
        v-if="item.type === 'select' && !item.range"
        v-model="form[item.prop]"
        placeholder="select a value"
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
      <el-date-picker
        v-if="item.type === 'date' && !item.range"
        v-model="form[item.prop]"
        type="datetimerange"
        start-placeholder="Start date"
        end-placeholder="End date"
      />
      <el-input
        v-if="item.type === 'textarea' && !item.range"
        v-model="form[item.prop]"
        type="textarea"
        placeholder="enter a value"
        clearable
      />
      <div
        v-if="item.range"
        style="display: flex"
      >
        <el-col :span="5">
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop1]"
            placeholder=""
            clearable
          />
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop1]"
            placeholder=""
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
        <el-col :span="5">
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop2]"
            placeholder=""
            clearable
            style="width: 100%"
          />
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop2]"
            placeholder=""
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
      form: this.baseForm
    };
  },
  watch: {
    baseForm(val) {
      this.form = val;
    }
  }
};
</script>

<style scoped>
.btn-position {
  float: right;
}
</style>

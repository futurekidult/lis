<template>
  <section class="section-border">
    <div class="flex-between">
      <div class="select-title">
        <el-divider direction="vertical" /> SKU列表
      </div>
      <div>
        <el-input
          v-model="keyword"
          clearable
          placeholder="SKU搜索"
        >
          <template #suffix>
            <el-icon
              class="icon-click"
              @click="queryList"
            >
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="showSkuDialog('create')"
        >
          新增
        </el-button>
      </div>
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
          @click="showSkuDialog('update', slotProps.row.id, slotProps.row.name)"
        >
          修改
        </el-button>
      </template>
    </base-table>
    <!-- 平台弹窗 -->
    <base-option
      v-if="skuVisible"
      v-model="skuVisible"
      :title="skuType === 'create' ? '新增SKU' : '修改SKU'"
      width="25%"
      @close-dialog="closeSku"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item
          :label="skuType === 'create' ? 'SKU' : '新SKU名'"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入内容"
            clearable
            :type="skuType === 'create' ? 'textarea' : 'text'"
            rows="6"
          />
        </el-form-item>
        <div
          v-if="skuType === 'create'"
          class="cue-context"
        >
          提示：一行一个SKU，每个SKU长度不超过30字符，只能输入英文数字，中划线，下划线
        </div>
        <el-form-item style="float: right; margin-top: 40px">
          <el-button @click="closeSku">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitSku"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </base-option>
    <!-- 新增出错弹窗 -->
    <base-option
      v-model="errorVisible"
      title="新增店铺"
      width="25%"
      @close-dialog="closeError"
    >
      <error
        :error="error"
        label="SKU"
      />
    </base-option>
  </section>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import BaseOption from '../../../common/base-option-dialog.vue';
import Error from '../common/base-error-table.vue';

export default {
  components: {
    Search,
    Error,
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
      keyword: '',
      skuId: 0,
      skuType: '',
      skuVisible: false,
      errorVisible: false,
      formRules: {
        name: [
          {
            required: true,
            message: '请输入'
          }
        ]
      },
      error: {}
    };
  },
  watch: {
    keyword(val) {
      if (val === '') {
        this.clearAll();
      }
    }
  },
  mounted() {
    this.getSku();
  },
  methods: {
    async getSku() {
      try {
        await this.$store.dispatch('system/base/getSku', {
          params: {
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size,
            name: this.keyword
          }
        });
        let sku = this.$store.state.system.base;
        this.table = {
          tableData: sku.sku,
          tableFields: [
            {
              label: 'ID',
              prop: 'id',
              width: '90px',
              show: true
            },
            {
              label: 'SKU名称',
              prop: 'name',
              width: '1030px',
              show: true
            },
            {
              label: '创建时间',
              prop: 'create_time',
              width: '400px',
              show: true
            }
          ]
        };
        this.total = sku.skuLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getSku();
    },
    clearAll() {
      this.pagination = {
        current_page: 1,
        page_size: 10
      };
      this.getSku();
    },
    changePagination(val) {
      this.pagination = val;
      this.getSku();
    },
    showSkuDialog(type, id, name) {
      this.skuType = type;
      if (type === 'update') {
        this.skuId = id;
        this.form.name = name;
        this.formRules.name[1] = {
          pattern: /^[A-Za-z0-9_-]+$/,
          message: '只允许英文，数字，下划线，中划线'
        };
        this.formRules.name[2] = {
          min: 1,
          max: 30,
          message: '最多只允许输入30位'
        };
      } else {
        this.form.name = '';
        this.formRules.name[1] = {
          min: 1,
          max: 1000,
          message: '最多只允许输入1000位'
        };
      }
      this.skuVisible = true;
    },
    closeSku() {
      this.skuVisible = false;
      this.$refs.form.resetFields();
    },
    closeError() {
      this.errorVisible = false;
    },
    async createSku() {
      try {
        await this.$store.dispatch('system/base/createSku', {
          name: this.form.name
        });
        this.error = this.$store.state.system.base.skuError;
        if (JSON.stringify(this.error) === '{}') {
          this.errorVisible = false;
          this.skuVisible = false;
          this.$refs.form.resetFields();
          this.pagination.current_page = 1;
        } else {
          this.errorVisible = true;
        }
        this.getSku();
      } catch (err) {
        return;
      }
    },
    async updateSku() {
      try {
        await this.$store.dispatch('system/base/updateSku', {
          id: this.skuId,
          name: this.form.name
        });
        this.skuVisible = false;
        this.$refs.form.resetFields();
        this.getSku();
      } catch (err) {
        return;
      }
    },
    async submitSku() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.skuType === 'create') {
            if (this.form.name.length === 1000) {
              this.$message.warning('超出规定字数，请检查最后一项是否被截断');
            } else {
              this.createSku();
            }
          } else {
            this.updateSku();
          }
        }
      });
    }
  }
};
</script>

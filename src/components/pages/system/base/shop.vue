<template>
  <section class="section-border">
    <div class="flex-between">
      <div class="select-title">
        <el-divider direction="vertical" /> 店铺列表
      </div>
      <div>
        <el-input
          v-model="keyword"
          clearable
          placeholder="店铺搜索"
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
          @click="showShopDialog('create')"
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
          @click="
            showShopDialog('update', slotProps.row.id, slotProps.row.name)
          "
        >
          修改
        </el-button>
      </template>
    </base-table>
    <!-- 平台弹窗 -->
    <base-option
      v-if="shopVisible"
      v-model="shopVisible"
      :title="shopType === 'create' ? '新增店铺' : '修改店铺'"
      width="25%"
      @close-dialog="closeShop"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item
          :label="shopType === 'create' ? '店铺' : '新店铺名'"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入内容"
            clearable
            :type="shopType === 'create' ? 'textarea' : 'text'"
            rows="6"
          />
        </el-form-item>
        <div
          v-if="shopType === 'create'"
          class="cue-context"
        >
          一行一个店铺，每个店铺长度不超过30字符，只能输入英文数字，中划线，下划线，空格
        </div>
        <el-form-item style="float: right; margin-top: 40px">
          <el-button @click="closeShop">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitShop"
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
        label="店铺"
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
      shopId: 0,
      shopType: '',
      shopVisible: false,
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
    this.getShop();
  },
  methods: {
    async getShop() {
      try {
        await this.$store.dispatch('system/base/getShop', {
          params: {
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size,
            name: this.keyword
          }
        });
        let shop = this.$store.state.system.base;
        this.table = {
          tableData: shop.shop,
          tableFields: [
            {
              label: 'ID',
              prop: 'id',
              width: '90px',
              show: true
            },
            {
              label: '店铺名称',
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
        this.total = shop.shopLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getShop();
    },
    clearAll() {
      this.pagination = {
        current_page: 1,
        page_size: 10
      };
      this.getShop();
    },
    changePagination(val) {
      this.pagination = val;
      this.getShop();
    },
    showShopDialog(type, id, name) {
      this.shopType = type;
      if (type === 'update') {
        this.shopId = id;
        this.form.name = name;
        this.formRules.name[1] = {
          pattern: /^[A-Za-z0-9 _-]+$/,
          message: '只允许英文，数字，下划线，中划线，空格'
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
      this.shopVisible = true;
    },
    closeShop() {
      this.shopVisible = false;
      this.$refs.form.resetFields();
    },
    closeError() {
      this.errorVisible = false;
    },
    async createShop() {
      try {
        await this.$store.dispatch('system/base/createShop', {
          name: this.form.name
        });
        this.error = this.$store.state.system.base.shopError;
        if (JSON.stringify(this.error) === '{}') {
          this.errorVisible = false;
          this.shopVisible = false;
          this.$refs.form.resetFields();
          this.pagination.current_page = 1;
        } else {
          this.errorVisible = true;
        }
        this.getShop();
      } catch (err) {
        return;
      }
    },
    async updateShop() {
      try {
        await this.$store.dispatch('system/base/updateShop', {
          id: this.shopId,
          name: this.form.name
        });
        this.shopVisible = false;
        this.$refs.form.resetFields();
        this.getShop();
      } catch (err) {
        return;
      }
    },
    async submitShop() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.shopType === 'create') {
            if (this.form.name.length === 1000) {
              this.$message.warning('超出规定字数，请检查最后一项是否被截断');
            } else {
              this.createShop();
            }
          } else {
            this.updateShop();
          }
        }
      });
    }
  }
};
</script>

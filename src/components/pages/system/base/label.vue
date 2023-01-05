<template>
  <section class="section-border">
    <div class="flex-between">
      <div class="select-title">
        <el-divider direction="vertical" /> 标签列表
      </div>
      <div>
        <el-input
          v-model="keyword"
          clearable
          placeholder="标签搜索"
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
          @click="showLabelDialog('create')"
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
            showLabelDialog('update', slotProps.row.id, slotProps.row.name)
          "
        >
          修改
        </el-button>
      </template>
    </base-table>
    <!-- 平台弹窗 -->
    <base-option
      v-if="labelVisible"
      v-model="labelVisible"
      :title="labelType === 'create' ? '新增标签' : '修改标签'"
      width="25%"
      @close-dialog="closeLabel"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          :label="labelType === 'create' ? '标签' : '新标签名'"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
        <el-form-item style="float: right; margin-top: 40px">
          <el-button @click="closeLabel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitLabel"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </base-option>
  </section>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import BaseOption from '../../../common/base-option-dialog.vue';

export default {
  components: {
    Search,
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
      labelId: 0,
      labelType: '',
      labelVisible: false,
      formRules: {
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
            max: 10,
            message: '最多只允许输入10位'
          }
        ]
      }
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
    this.getLabel();
  },
  methods: {
    async getLabel() {
      try {
        await this.$store.dispatch('system/base/getLabel', {
          params: {
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size,
            name: this.keyword
          }
        });
        let label = this.$store.state.system.base;
        this.table = {
          tableData: label.label,
          tableFields: [
            {
              label: 'ID',
              prop: 'id',
              width: '90px',
              show: true
            },
            {
              label: '标签名称',
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
        this.total = label.labelLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getLabel();
    },
    clearAll() {
      this.pagination = {
        current_page: 1,
        page_size: 10
      };
      this.getLabel();
    },
    changePagination(val) {
      this.pagination = val;
      this.getLabel();
    },
    showLabelDialog(type, id, name) {
      this.labelType = type;
      if (type === 'update') {
        this.labelId = id;
        this.form.name = name;
      } else {
        this.form.name = '';
      }
      this.labelVisible = true;
    },
    closeLabel() {
      this.labelVisible = false;
      this.$refs.form.resetFields();
    },
    async createLabel() {
      try {
        await this.$store.dispatch('system/base/createLabel', {
          name: this.form.name
        });
        this.labelVisible = false;
        this.$refs.form.resetFields();
        this.pagination.current_page = 1;
        this.getLabel();
      } catch (err) {
        return;
      }
    },
    async updateLabel() {
      try {
        await this.$store.dispatch('system/base/updateLabel', {
          id: this.labelId,
          name: this.form.name
        });
        this.labelVisible = false;
        this.$refs.form.resetFields();
        this.getLabel();
      } catch (err) {
        return;
      }
    },
    async submitLabel() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.labelType === 'create') {
            this.createLabel();
          } else {
            this.updateLabel();
          }
        }
      });
    }
  }
};
</script>

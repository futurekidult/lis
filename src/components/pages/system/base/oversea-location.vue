<template>
  <section class="section-border">
    <div class="flex-between">
      <div class="select-title">
        <el-divider direction="vertical" /> 海外仓列表
      </div>
      <div>
        <el-input
          v-model="keyword"
          clearable
          placeholder="海外仓搜索"
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
          @click="showOverseaLocationDialog('create')"
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
            showOverseaLocationDialog(
              'update',
              slotProps.row.id,
              slotProps.row.name
            )
          "
        >
          修改
        </el-button>
      </template>
    </base-table>
    <!-- 海外仓弹窗 -->
    <base-option
      v-if="overseaLocationVisible"
      v-model="overseaLocationVisible"
      :title="overseaLocationType === 'create' ? '新增海外仓' : '修改海外仓'"
      width="25%"
      @close-dialog="closeOverseaLocation"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          :label="overseaLocationType === 'create' ? '海外仓' : '新海外仓名'"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
        <el-form-item style="float: right; margin-top: 40px">
          <el-button @click="closeOverseaLocation">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitOverseaLocation"
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
      overseaLocationId: 0,
      overseaLocationType: '',
      overseaLocationVisible: false,
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
    this.getOverseaLocation();
  },
  methods: {
    async getOverseaLocation() {
      try {
        await this.$store.dispatch('system/base/getOverseaLocation', {
          params: {
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size,
            name: this.keyword
          }
        });
        let overseaLocation = this.$store.state.system.base;
        this.table = {
          tableData: overseaLocation.overseaLocation,
          tableFields: [
            {
              label: 'ID',
              prop: 'id',
              width: '90px',
              show: true
            },
            {
              label: '海外仓名称',
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
        this.total = overseaLocation.overseaLocationLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getOverseaLocation();
    },
    clearAll() {
      this.pagination = {
        current_page: 1,
        page_size: 10
      };
      this.getOverseaLocation();
    },
    changePagination(val) {
      this.pagination = val;
      this.getOverseaLocation();
    },
    showOverseaLocationDialog(type, id, name) {
      this.overseaLocationType = type;
      if (type === 'update') {
        this.overseaLocationId = id;
        this.form.name = name;
      } else {
        this.form.name = '';
      }
      this.overseaLocationVisible = true;
    },
    closeOverseaLocation() {
      this.overseaLocationVisible = false;
      this.$refs.form.resetFields();
    },
    async createOverseaLocation() {
      try {
        await this.$store.dispatch('system/base/createOverseaLocation', {
          name: this.form.name
        });
        this.overseaLocationVisible = false;
        this.$refs.form.resetFields();
        this.pagination.current_page = 1;
        this.getOverseaLocation();
      } catch (err) {
        return;
      }
    },
    async updateOverseaLocation() {
      try {
        await this.$store.dispatch('system/base/updateOverseaLocation', {
          id: this.overseaLocationId,
          name: this.form.name
        });
        this.overseaLocationVisible = false;
        this.$refs.form.resetFields();
        this.getOverseaLocation();
      } catch (err) {
        return;
      }
    },
    async submitOverseaLocation() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.overseaLocationType === 'create') {
            this.createOverseaLocation();
          } else {
            this.updateOverseaLocation();
          }
        }
      });
    }
  }
};
</script>

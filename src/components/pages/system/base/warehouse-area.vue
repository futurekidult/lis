<template>
  <section class="section-border">
    <div class="flex-between">
      <div class="select-title">
        <el-divider direction="vertical" /> 仓库分布列表
      </div>
      <div>
        <el-input
          v-model="keyword"
          clearable
          placeholder="仓库分布搜索"
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
          @click="showWarehouseAreaDialog('create')"
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
            showWarehouseAreaDialog(
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
    <!-- 仓库分布弹窗 -->
    <base-option
      v-if="warehouseAreaVisible"
      v-model="warehouseAreaVisible"
      :title="warehouseAreaType === 'create' ? '新增仓库分布' : '修改仓库分布'"
      width="25%"
      @close-dialog="closeWarehouseArea"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          :label="
            warehouseAreaType === 'create' ? '仓库分布名' : '新仓库分布名'
          "
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
        <el-form-item style="float: right; margin-top: 40px">
          <el-button @click="closeWarehouseArea">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitWarehouseArea"
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
      warehouseAreaId: 0,
      warehouseAreaType: '',
      warehouseAreaVisible: false,
      formRules: {
        name: [
          {
            required: true,
            message: '请输入'
          },
          {
            pattern: /^[A-Za-z0-9_-]+$/,
            message: '只允许英文，数字，下划线，中划线'
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
    this.getWarehouseArea();
  },
  methods: {
    async getWarehouseArea() {
      try {
        await this.$store.dispatch('system/base/getWarehouseArea', {
          params: {
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size,
            name: this.keyword
          }
        });
        let warehouseArea = this.$store.state.system.base;
        this.table = {
          tableData: warehouseArea.warehouseArea,
          tableFields: [
            {
              label: 'ID',
              prop: 'id',
              width: '90px',
              show: true
            },
            {
              label: '仓库分布名称',
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
        this.total = warehouseArea.warehouseAreaLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getWarehouseArea();
    },
    clearAll() {
      this.pagination = {
        current_page: 1,
        page_size: 10
      };
      this.getWarehouseArea();
    },
    changePagination(val) {
      this.pagination = val;
      this.getWarehouseArea();
    },
    showWarehouseAreaDialog(type, id, name) {
      this.warehouseAreaType = type;
      if (type === 'update') {
        this.warehouseAreaId = id;
        this.form.name = name;
      } else {
        this.form.name = '';
      }
      this.warehouseAreaVisible = true;
    },
    closeWarehouseArea() {
      this.warehouseAreaVisible = false;
      this.$refs.form.resetFields();
    },
    async createWarehouseArea() {
      try {
        await this.$store.dispatch('system/base/createWarehouseArea', {
          name: this.form.name
        });
        this.warehouseAreaVisible = false;
        this.$refs.form.resetFields();
        this.pagination.current_page = 1;
        localStorage.removeItem('warehouse_area');
        this.getWarehouseArea();
      } catch (err) {
        return;
      }
    },
    async updateWarehouseArea() {
      try {
        await this.$store.dispatch('system/base/updateWarehouseArea', {
          id: this.warehouseAreaId,
          name: this.form.name
        });
        this.warehouseAreaVisible = false;
        this.$refs.form.resetFields();
        localStorage.removeItem('warehouse_area');
        this.getWarehouseArea();
      } catch (err) {
        return;
      }
    },
    async submitWarehouseArea() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.warehouseAreaType === 'create') {
            this.createWarehouseArea();
          } else {
            this.updateWarehouseArea();
          }
        }
      });
    }
  }
};
</script>

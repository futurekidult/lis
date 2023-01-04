<template>
  <section class="section-border">
    <div class="flex-between">
      <div class="select-title">
        <el-divider direction="vertical" /> 物流商列表
      </div>
      <el-input
        v-model="keyword"
        clearable
        placeholder="物流商英文名称搜索"
        @clear="clear"
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
          style="width: 40px"
          @click="viewMap(slotProps.row.id)"
        >
          查看映射
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          style="width: 40px; margin-left: 20px"
          @click="showCreateMap(slotProps.row.id)"
        >
          新增映射
        </el-button>
      </template>
    </base-table>
    <!-- 查看映射弹窗 -->
    <base-option
      v-model="viewMapVisible"
      title="查看映射"
      width="25%"
      @close-dialog="closeViewDialog"
    >
      <el-scrollbar height="300px">
        <base-table
          :table="mapTable"
          :icon-visible="false"
          :selection-visible="false"
          :pagination-visible="false"
        >
          <template #default="slotProps">
            <el-button
              link
              type="primary"
              size="small"
              style="width: 40px"
              @click="showConfirmDialog(slotProps.row.id)"
            >
              删除
            </el-button>
          </template>
        </base-table>
      </el-scrollbar>
    </base-option>
    <!-- 新增映射弹窗 -->
    <base-option
      v-model="createMapVisible"
      title="新增映射"
      width="25%"
      @close-dialog="closeCreateDialog"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          label="物流商映射"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
        <el-form-item style="float: right; margin-top: 40px">
          <el-button @click="closeCreateDialog">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="createMap"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </base-option>
    <!-- 删除确认弹窗 -->
    <base-confirm
      v-if="deleteMapVisible"
      :dialog-visible="deleteMapVisible"
      content="确定要删除该物流商映射吗"
      @get-visible="closeDeleteMapDialog"
      @confirm-deletion="deleteMap"
    />
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
      mapTable: {},
      pagination: {
        current_page: 1,
        page_size: 10
      },
      total: 0,
      form: {},
      mapId: 0,
      deleteId: 0,
      keyword: '',
      viewMapVisible: false,
      createMapVisible: false,
      deleteMapVisible: false,
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
            max: 30,
            message: '最多只允许输入30位'
          }
        ]
      }
    };
  },
  mounted() {
    this.getLogisticSupplier();
  },
  methods: {
    async getLogisticSupplier() {
      try {
        await this.$store.dispatch('system/base/getLogisticSupplier', {
          params: {
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size,
            name_en: this.keyword
          }
        });
        let logisticSupplier = this.$store.state.system.base;
        this.table = {
          tableData: logisticSupplier.logisticSupplier,
          tableFields: this.$global.LogisticSupplierTableFields
        };
        this.total = logisticSupplier.listLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getLogisticSupplier();
    },
    clear() {
      this.pagination = {
        current_page: 1,
        page_size: 10
      };
      this.getLogisticSupplier();
    },
    changePagination(val) {
      this.pagination = val;
      this.getLogisticSupplier();
    },
    async viewMap(id) {
      this.mapId = id;
      try {
        await this.$store.dispatch('system/base/getMap', {
          params: {
            id
          }
        });
        this.mapTable = {
          tableData: this.$store.state.system.base.mapList,
          tableFields: [
            {
              label: 'ID',
              prop: 'id',
              show: true,
              width: '90px'
            },
            {
              label: '物流商映射',
              prop: 'name',
              show: true
            }
          ]
        };
        this.viewMapVisible = true;
      } catch (err) {
        return;
      }
    },
    closeViewDialog() {
      this.viewMapVisible = false;
    },
    showCreateMap(id) {
      this.mapId = id;
      this.createMapVisible = true;
    },
    closeCreateDialog() {
      this.createMapVisible = false;
      this.$refs.form.resetFields();
    },
    async submitMap() {
      try {
        await this.$store.dispatch('system/base/createMap', {
          logistic_supplier_id: this.mapId,
          name: this.form.name
        });
        this.createMapVisible = false;
        this.$refs.form.resetFields();
      } catch (err) {
        return;
      }
    },
    async createMap() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitMap();
        }
      });
    },
    showConfirmDialog(id) {
      this.deleteId = id;
      this.deleteMapVisible = true;
    },
    closeDeleteMapDialog() {
      this.deleteMapVisible = false;
    },
    async deleteMap() {
      try {
        await this.$store.dispatch('system/base/deleteMap', {
          id: this.deleteId
        });
        this.deleteMapVisible = false;
        this.viewMap(this.mapId);
      } catch (err) {
        return;
      }
    }
  }
};
</script>

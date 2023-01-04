<template>
  <section class="section-border">
    <div class="flex-between">
      <div class="select-title">
        <el-divider direction="vertical" /> 平台列表
      </div>
      <div>
        <el-input
          v-model="keyword"
          clearable
          placeholder="平台搜索"
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
          @click="showPlatformDialog('create')"
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
            showPlatformDialog('update', slotProps.row.id, slotProps.row.name)
          "
        >
          修改
        </el-button>
      </template>
    </base-table>
    <!-- 平台弹窗 -->
    <base-option
      v-if="platformVisible"
      v-model="platformVisible"
      :title="platformType === 'create' ? '新增平台' : '修改平台'"
      width="25%"
      @close-dialog="closePlatform"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          :label="platformType === 'create' ? '平台' : '新平台名'"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
        <el-form-item style="float: right; margin-top: 40px">
          <el-button @click="closePlatform">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitPlatform"
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
      platformId: 0,
      platformType: '',
      platformVisible: false,
      formRules: {
        name: [
          {
            required: true,
            message: '请输入'
          },
          {
            pattern: /^[A-Za-z]+$/,
            message: '只允许英文'
          },
          {
            min: 1,
            max: 20,
            message: '最多只允许输入20位'
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
    this.getPlatform();
  },
  methods: {
    async getPlatform() {
      try {
        await this.$store.dispatch('system/base/getPlatform', {
          params: {
            current_page: this.pagination.current_page,
            page_size: this.pagination.page_size,
            name: this.keyword
          }
        });
        let platform = this.$store.state.system.base;
        this.table = {
          tableData: platform.platform,
          tableFields: [
            {
              label: 'ID',
              prop: 'id',
              width: '90px',
              show: true
            },
            {
              label: '平台名称',
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
        this.total = platform.platformLength;
      } catch (err) {
        return;
      }
    },
    queryList() {
      this.pagination.current_page = 1;
      this.getPlatform();
    },
    clearAll() {
      this.pagination = {
        current_page: 1,
        page_size: 10
      };
      this.getPlatform();
    },
    changePagination(val) {
      this.pagination = val;
      this.getPlatform();
    },
    showPlatformDialog(type, id, name) {
      this.platformType = type;
      if (type === 'update') {
        this.platformId = id;
        this.form.name = name;
      } else {
        this.form.name = '';
      }
      this.platformVisible = true;
    },
    closePlatform() {
      this.platformVisible = false;
      this.$refs.form.resetFields();
    },
    async createPlatform() {
      try {
        await this.$store.dispatch('system/base/createPlatform', {
          name: this.form.name
        });
        this.platformVisible = false;
        this.$refs.form.resetFields();
        this.pagination.current_page = 1;
        this.getPlatform();
      } catch (err) {
        return;
      }
    },
    async updatePlatform() {
      try {
        await this.$store.dispatch('system/base/updatePlatform', {
          id: this.platformId,
          name: this.form.name
        });
        this.platformVisible = false;
        this.$refs.form.resetFields();
        this.getPlatform();
      } catch (err) {
        return;
      }
    },
    async submitPlatform() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.platformType === 'create') {
            this.createPlatform();
          } else {
            this.updatePlatform();
          }
        }
      });
    }
  }
};
</script>

<template>
  <section>
    <div class="section-border">
      <div class="select-title">
        <el-divider direction="vertical" /> 筛选条件
      </div>

      <div class="flex-between">
        <el-form
          label-width="60px"
          style="display: flex"
          :model="chooseForm"
        >
          <el-form-item label="姓名">
            <el-input
              v-model="chooseForm.name"
              placeholder="请输入姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="部门">
            <el-tree-select
              ref="tree"
              v-model="chooseForm.dept_ids"
              :data="$store.state.system.organizationList"
              clearable
              multiple
              collapse-tags
              show-checkbox
              :props="defaultProps"
              @clear="clearDeptIds"
              @change="getCheckedNodes"
              @remove-tag="removeTag"
              @check-change="getCheckedNodes"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="chooseForm.state"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="item in state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button
            type="primary"
            @click="searchAdmin"
          >
            查询
          </el-button>
          <el-button
            class="reset-btn"
            @click="resetForm"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div class="section-border">
      <div class="select-title">
        <el-divider direction="vertical" /> 用户列表
      </div>

      <div v-loading="$store.state.system.adminLoading">
        <el-table
          stripe
          border
          :data="adminList"
          empty-text="无数据"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column
            label="姓名"
            prop="name"
          />
          <el-table-column
            label="所属部门"
            prop="department"
          />
          <el-table-column label="状态">
            <template #default="scope">
              <div :style="{ color: adminStateColor(scope.row.state) }">
                {{ scope.row.state_desc }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                :disabled="scope.row.state === 3"
                :type="scope.row.state === 1 ? 'danger' : 'primary'"
                @click="
                  scope.row.state === 1
                    ? blockAdmin(scope.row.id)
                    : unblockAdmin(scope.row.id)
                "
              >
                {{ scope.row.state === 1 ? '封禁账号' : '解除封禁' }}
              </el-button>
              <el-button
                type="warning"
                :disabled="scope.row.state !== 1"
                @click="showRoleForm(scope.row.id)"
              >
                配置角色
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="position-right">
          <el-pagination
            v-if="$store.state.system.adminListLength > pageSize"
            :total="$store.state.system.adminListLength"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            small
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize"
            @current-change="changeCurrentPage"
          />
        </div>
      </div>
    </div>
    <base-option
      v-model="roleVisible"
      title="配置用户角色"
      width="30%"
      @close-dialog="closeRoleForm"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        label-width="120px"
      >
        <el-form-item
          label="用户角色组"
          prop="role_ids"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <el-checkbox-group
            v-model="roleForm.role_ids"
            clearable
          >
            <el-checkbox
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.id"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <div class="bg">
            角色组定义了用户可访问的功能模块和可执行操作, 可多选
          </div>
        </el-form-item>
        <el-divider />
        <div style="text-align: right">
          <el-button
            class="close-btn"
            @click="closeRoleForm"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitRoleForm"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </base-option>
  </section>
</template>

<script>
import { adminStateColor } from '../../../utils/index.js';

export default {
  data() {
    return {
      roleVisible: false,
      roleForm: {},
      adminId: 0,
      adminList: [],
      roleList: [],
      chooseForm: {},
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      currentPage: 1,
      pageSize: 10,
      state: [
        {
          label: '启用状态',
          value: 1
        },
        {
          label: '禁用状态',
          value: 2
        },
        {
          label: '离职状态',
          value: 3
        }
      ]
    };
  },
  mounted() {
    this.getAdminList();
    this.getOrganizationList();
  },
  methods: {
    adminStateColor,
    async getOrganizationList() {
      this.$store.commit('system/setOrganizationLoading', true);
      try {
        await this.$store.dispatch('system/getOrganizationList');
      } catch (err) {
        this.$store.commit('system/setOrganizationLoading', false);
        return;
      }
    },
    async getAdminList() {
      let params = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        name: this.chooseForm.name,
        dept_ids: !this.chooseForm.dept_ids
          ? []
          : this.chooseForm.dept_ids.join(','),
        state: this.chooseForm.state
      };
      try {
        this.$store.commit('system/setAdminLoading', true);
        await this.$store.dispatch('system/getAdminList', { params });
        this.adminList = this.$store.state.system.adminList;
      } catch (err) {
        this.$store.commit('system/setAdminLoading', false);
        return;
      }
    },
    async getRoleList() {
      this.$store.commit('system/setSystemRoleLoading', true);
      try {
        await this.$store.dispatch('system/getSystemRoleList');
        this.roleList = this.$store.state.system.systemRoleList;
      } catch (err) {
        this.$store.commit('system/setSystemRoleLoading', false);
        return;
      }
    },
    async showRoleForm(id) {
      try {
        this.getRoleList();
        await this.$store.dispatch('system/getAdminRole', { params: { id } });
        this.roleForm = this.$store.state.system.adminRole;
        this.roleVisible = true;
        this.$refs.roleForm.resetFields();
      } catch (err) {
        return;
      }
    },
    async updateAdminRole(body) {
      try {
        await this.$store.dispatch('system/updateAdminRole', body);
        this.roleVisible = false;
        this.getAdminList();
      } catch (err) {
        return;
      }
    },
    closeRoleForm() {
      this.roleVisible = false;
    },
    submitRoleForm() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.updateAdminRole(this.roleForm);
        }
      });
    },
    async blockAdmin(id) {
      try {
        await this.$store.dispatch('system/blockAdmin', { id });
        this.getAdminList();
      } catch (err) {
        return;
      }
    },
    async unblockAdmin(id) {
      try {
        await this.$store.dispatch('system/unblockAdmin', { id });
        this.getAdminList();
      } catch (err) {
        return;
      }
    },
    resetForm() {
      this.chooseForm = {};
      this.pageSize = 10;
      this.searchAdmin();
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getAdminList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAdminList();
    },
    searchAdmin() {
      this.currentPage = 1;
      this.getAdminList();
    },
    getCheckedNodes(nodeData) {
      this.chooseForm.dept_ids = [];
      let checkedArr = this.$refs.tree.getCheckedNodes();
      for (let i in checkedArr) {
        this.chooseForm.dept_ids.push(checkedArr[i].value);
      }
      if (nodeData.id) {
        let node = this.$refs.tree.getNode(nodeData.id);
        this.expandCheckedNotExpandNodes(node);
      }
    },
    expandCheckedNotExpandNodes(node) {
      let { tree } = this.$refs;
      if (node.checked && !node.expanded && !node.isLeaf) {
        node.expand(() => {
          let { childNodes } = node;
          for (let i = 0; i < childNodes.length; i++) {
            let childNode = childNodes[i];
            tree.$emit(
              'check-change',
              childNode.data,
              childNode.checked,
              childNode.indeterminate
            );
          }
        });
      }
    },
    clearDeptIds() {
      this.$refs.tree.setCheckedKeys([]);
      this.chooseForm.dept_ids = [];
      this.getAdminList();
    },
    removeTag(val) {
      this.$refs.tree.setChecked(val, false, true);
    }
  }
};
</script>

<style scoped>
.bg {
  background: #e9f0f2;
  padding: 5px 10px;
  color: #999999;
  font-size: 13px;
}

.option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}

.el-tree {
  color: #999999 !important;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: right;
}
</style>

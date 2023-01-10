<template>
  <section>
    <div class="section-border">
      <div class="flex-between">
        <div class="select-title">
          <el-divider direction="vertical" /> 角色列表
        </div>
        <el-button
          type="primary"
          @click="showCreateDialog"
        >
          新增角色
        </el-button>
      </div>

      <div v-loading="$store.state.system.systemRoleLoading">
        <el-table
          stripe
          border
          :data="roleList"
          empty-text="无数据"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column
            label="角色名称"
            prop="name"
          />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="danger"
                class="close-btn"
                @click="showDeleteRole(scope.row.id)"
              >
                删除
              </el-button>
              <el-button @click="showViewDialog(scope.row.id, true)">
                查看成员
              </el-button>
              <el-button
                type="primary"
                @click="showEditDialog(scope.row.id)"
              >
                编辑角色
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <role-form
        v-if="createVisible"
        title="新增角色"
        type="create"
        :dialog-visible="createVisible"
        :get-list="getRoleList"
        :close-on-click-modal="false"
        @hide-dialog="closeCreateDialog"
      />
      <role-form
        v-if="editVisible"
        :id="roleId"
        title="编辑角色"
        type="edit"
        :dialog-visible="editVisible"
        :get-list="getRoleList"
        :close-on-click-modal="false"
        @hide-dialog="closeEditDialog"
      />
      <base-confirm
        v-if="confirmDialog"
        :dialog-visible="confirmDialog"
        content="确定要删除该角色吗"
        @get-visible="closeConfirmDialog"
        @confirm-deletion="deleteRole"
      />
    </div>
    <base-option
      v-model="viewMemberDialogVisible"
      title="查看成员"
      width="45%"
      @close-dialog="closeViewDialog"
    >
      <el-table
        :data="memberList"
        border
        stripe
        empty-text="无数据"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          prop="name"
          label="姓名"
          width="100"
        />
        <el-table-column
          prop="department"
          label="所属部门"
        />
        <el-table-column
          label="状态"
          width="100"
          fixed="right"
        >
          <template #default="scope">
            <div :style="{ color: adminStateColor(scope.row.state) }">
              {{ scope.row.state_desc }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="position-right">
        <el-pagination
          v-if="$store.state.system.roleRelatedMemberListLength > pageSize"
          :total="$store.state.system.roleRelatedMemberListLength"
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
    </base-option>
  </section>
</template>

<script>
import RoleForm from './common/role-form.vue';
import { adminStateColor } from '../../../utils/index.js';

export default {
  components: {
    RoleForm
  },
  data() {
    return {
      createVisible: false,
      editVisible: false,
      confirmDialog: false,
      viewMemberDialogVisible: false,
      roleId: 0,
      deleteId: 0,
      roleList: [],
      currentPage: 1,
      pageSize: 10,
      memberList: []
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    adminStateColor,
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
    async deleteRole() {
      try {
        await this.$store.dispatch('system/deleteRole', {
          id: this.deleteId
        });
        this.confirmDialog = false;
        this.getRoleList();
      } catch (err) {
        return;
      }
    },
    showCreateDialog() {
      this.createVisible = true;
    },
    closeCreateDialog() {
      this.createVisible = false;
    },
    showEditDialog(id) {
      this.editVisible = true;
      this.roleId = id;
    },
    closeEditDialog() {
      this.editVisible = false;
    },
    showDeleteRole(id) {
      this.confirmDialog = true;
      this.deleteId = id;
    },
    closeConfirmDialog() {
      this.confirmDialog = false;
    },
    async getRoleRelatedMemberList(id, showDialog) {
      try {
        let params = {
          role_id: id,
          current_page: this.currentPage,
          page_size: this.pageSize
        };
        await this.$store.dispatch('system/getRoleRelatedMemberList', {
          params
        });
        this.memberList = this.$store.state.system.roleRelatedMemberList;
        if (showDialog) {
          this.viewMemberDialogVisible = true;
        }
      } catch (err) {
        return;
      }
    },
    showViewDialog(id, showDialog) {
      this.roleId = id;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getRoleRelatedMemberList(id, showDialog);
    },
    closeViewDialog() {
      this.viewMemberDialogVisible = false;
    },
    changePageSize(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getRoleRelatedMemberList(this.roleId, false);
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getRoleRelatedMemberList(this.roleId, false);
    }
  }
};
</script>

<style scoped>
.prompt-literal {
  margin-bottom: 30px;
  text-align: center;
}

.prompt-operate {
  text-align: center;
}
</style>

<template>
  <section>
    <base-choose
      @get-options="getChooseForm"
      @search-form="search"
      @get-pagination="getChangedData"
    >
      <template #default="slotProps">
        <el-button
          link
          type="success"
          size="small"
          @click="viewItem(slotProps.row.id)"
        >
          Detail
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          @click="editItem(slotProps.row.id, slotProps.row.state)"
        >
          Edit
        </el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="showDeleteItemDialog(slotProps.row.id)"
        >
          Delete
        </el-button>
      </template>
    </base-choose>
    <base-confirm
      v-if="deleteDialogVisible"
      :dialog-visible="deleteDialogVisible"
      content="是否确认删除用户?"
      @get-visible="closeDeleteItemDialog"
      @confirm-deletion="confirmDeletion"
    />

    <el-dialog
      v-model="editDialogVisible"
      title="修改"
      width="30%"
      :close-on-click-modal="false"
    >
      <base-form
        ref="editForm"
        :properties="$route.meta.editProperties"
        :base-form="editForm"
        :inline="false"
        width="100px"
        :base-rules="$route.meta.editRules"
      >
        <el-button @click="submit(0)">
          保存
        </el-button>
        <el-button
          type="primary"
          @click="submit(1)"
        >
          提交
        </el-button>
      </base-form>
    </el-dialog>
  </section>
</template>

<script>
import BaseForm from '../../common/base-form.vue';

export default {
  components: {
    BaseForm
  },
  provide() {
    return {
      getTable: () => {
        return {
          tableFields: this.tableFields,
          tableData: this.listData,
          total: this.total
        };
      }
    };
  },
  data() {
    return {
      tableFields: this.$global.demoTableFields,
      listData: [],
      id: 0,
      total: 20,
      chooseForm: {},
      editForm: {},
      deleteDialogVisible: false,
      editDialogVisible: false,
      pagination: {}
    };
  },
  mounted() {
    this.getListData(false, this.pagination);
  },
  methods: {
    async getListData(dialog = true, pagination) {
      let params = this.chooseForm;
      params['current_page'] = pagination.current_page;
      params['page_size'] = pagination.page_size;
      try {
        await this.$store.dispatch('demo/getListData', { params });
        this.listData = this.$store.state.demo.listData;
        if (dialog) {
          this.deleteDialogVisible = false;
        }
      } catch (err) {
        return;
      }
    },
    search() {
      this.getListData(false, this.pagination);
    },
    showDeleteItemDialog(id) {
      this.id = id;
      this.deleteDialogVisible = true;
    },
    closeDeleteItemDialog() {
      this.deleteDialogVisible = false;
    },
    confirmDeletion() {
      this.getListData(true, this.pagination);
    },
    viewItem(id) {
      this.id = id;
      //执行查看详情的操作
    },
    editItem(id, state) {
      this.id = id;
      this.editForm = {
        state
      };
      this.editDialogVisible = true;
    },
    getChooseForm(val) {
      this.chooseForm = val;
    },
    submit(operation) {
      if (operation === 0) {
        //执行save操作
      } else {
        this.$refs.editForm.$refs.form.validate((valid) => {
          if (valid) {
            //执行通过校验后的提交操作
          }
        });
      }
    },
    getChangedData(val) {
      this.pagination = val;
      this.getListData(false, val);
    }
  }
};
</script>

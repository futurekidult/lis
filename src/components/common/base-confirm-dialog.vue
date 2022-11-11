<template>
  <el-dialog
    v-model="visible"
    title="提示"
    width="30%"
    align-center
    center
    :close-on-click-modal="false"
    @close="cancel"
  >
    <div style="text-align: center">
      {{ content }}
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="deleteItem"
        > 确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  },
  emits: ['get-visible', 'confirm-deletion'],
  data() {
    return {
      visible: this.dialogVisible
    };
  },
  methods: {
    deleteItem() {
      this.$emit('confirm-deletion');
    },
    cancel() {
      this.visible = false;
      this.$emit('get-visible', this.visible);
    }
  }
};
</script>

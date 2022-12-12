<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    align-center
    @close="closeDialog"
  >
    <slot />
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    }
  },
  emits: ['close-dialog'],
  data() {
    return {
      visible: this.dialogVisible
    };
  },
  methods: {
    closeDialog() {
      this.visible = false;
      this.$emit('close-dialog', this.visible);
    }
  }
};
</script>

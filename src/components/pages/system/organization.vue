<template>
  <div class="section-border">
    <div class="select-title">
      <el-divider direction="vertical" /> 部门列表
    </div>

    <el-tree
      v-loading="$store.state.system.organizationLoading"
      :data="organizationList"
      :props="defaultProps"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      organizationList: []
    };
  },
  mounted() {
    this.getOrganizationList();
  },
  methods: {
    async getOrganizationList() {
      this.$store.commit('system/setOrganizationLoading', true);
      try {
        await this.$store.dispatch('system/getOrganizationList');
        this.organizationList = this.$store.state.system.organizationList;
      } catch (err) {
        this.$store.commit('system/setOrganizationLoading', false);
        return;
      }
    }
  }
};
</script>

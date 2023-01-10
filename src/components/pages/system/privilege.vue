<template>
  <div class="section-border">
    <div class="select-title">
      <el-divider direction="vertical" /> 菜单权限列表
    </div>

    <el-tree
      v-loading="$store.state.system.privilegeLoading"
      :data="privilegeList"
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
      privilegeList: []
    };
  },
  mounted() {
    this.getPrivilegeList();
  },
  methods: {
    async getPrivilegeList() {
      this.$store.commit('system/setPrivilegeLoading', true);
      try {
        await this.$store.dispatch('system/getPrivilegeList');
        this.privilegeList = this.$store.state.system.privilegeList;
      } catch (err) {
        this.$store.commit('system/setPrivilegeLoading', false);
        return;
      }
    }
  }
};
</script>

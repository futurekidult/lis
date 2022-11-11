<template>
  <section>
    <el-dropdown
      trigger="click"
      style="float: right"
    >
      <el-button
        link
        type="primary"
      >
        <el-icon>
          <Operation />
        </el-icon>
        显示列
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-tree
            :data="table.tableFields"
            :props="defaultProps"
            draggable
            :allow-drop="handleDrop"
            @node-drop="dropOk"
          >
            <template #default="{ node, data }">
              <el-icon>
                <Menu />
              </el-icon>
              <span class="column"> {{ node.label }}</span>
              <el-switch v-model="data.show" />
            </template>
          </el-tree>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-table
      :key="tableKey"
      border
      :data="table.tableData"
    >
      <template v-for="item in table.tableFields">
        <el-table-column
          v-if="item.show"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
        >
          <template #default="scope">
            <span>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template #default="scope">
          <slot :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { Operation, Menu } from '@element-plus/icons-vue';

export default {
  components: {
    Operation,
    Menu
  },
  inject: ['getTable'],
  data() {
    return {
      tableKey: 1,
      defaultProps: {
        label: 'label'
      }
    };
  },
  computed: {
    table() {
      return this.getTable();
    }
  },
  methods: {
    handleDrop(draggingNode, dropNode, type) {
      return type !== 'inner';
    },
    dropOk() {
      this.tableKey++;
    }
  }
};
</script>

<style scoped>
.column {
  min-width: 150px;
  display: inline-block;
}

.el-icon,
.el-switch {
  margin-right: 16px !important;
}
</style>

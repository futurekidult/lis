<template>
  <section>
    <el-dropdown
      v-if="iconVisible"
      trigger="click"
      style="float: right; margin-top: -40px"
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
          <el-scrollbar height="400px">
            <el-tree
              :data="table.tableFields"
              :props="defaultProps"
              draggable
              :allow-drop="handleDrop"
              @node-drop="dropOk"
            >
              <template #default="{ node, data }">
                <el-icon><Grid /></el-icon>
                <span class="column"> {{ node.label }}</span>
                <el-switch
                  v-model="data.show"
                  @change="changeStatus(table.tableFields)"
                />
                <el-icon
                  @click="toFixedPosition('left', node, table.tableFields)"
                >
                  <ArrowLeft />
                </el-icon>
                <el-icon
                  @click="toFixedPosition('right', node, table.tableFields)"
                >
                  <ArrowRight />
                </el-icon>
              </template>
            </el-tree>
          </el-scrollbar>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-table
      :key="tableKey"
      border
      :data="table.tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="selectionVisible"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="indexVisible"
        label="序号"
        type="index"
        align="center"
        width="80px"
      />
      <template v-for="item in table.tableFields">
        <el-table-column
          v-if="item.show"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :width="getWidth(item.width)"
          align="center"
        >
          <template
            v-if="item.prop === 'label'"
            #default="scope"
          >
            <el-tag
              v-for="label in scope.row[item.prop]"
              :key="label"
              closable
              effect="plain"
              style="width: 80px"
              @close="deleteLabel(label.id, scope.row.id)"
            >
              {{ label.name }}
            </el-tag>
          </template>
          <template
            v-else
            #default="scope"
          >
            <span
              v-if="
                item.prop === 'exception_handling_desc' ||
                  item.prop === 'sync_state_desc'
              "
              :style="{
                color: changeContentColor(
                  item.prop,
                  scope.row[item.prop.replace('_desc', '')]
                )
              }"
            >{{ scope.row[item.prop] }}</span>
            <span
              v-else-if="
                item.prop === 'stay_time' ||
                  item.prop === 'receipt_days' ||
                  item.prop === 'delivery_days'
              "
              :style="{
                color: changeContentColor(item.prop, scope.row[item.prop])
              }"
            >{{ scope.row[item.prop] }}</span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="operationVisible"
        fixed="right"
        label="操作"
        width="150px"
        align="center"
      >
        <template #default="scope">
          <slot :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="paginationVisible"
      class="position-right"
    >
      <el-pagination
        v-if="dataTotal > listPagination.page_size"
        :current-page="listPagination.current_page"
        :page-size="listPagination.page_size"
        :page-sizes="[10, 20, 30, 40]"
        small
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </section>
</template>

<script>
import {
  Grid,
  Operation,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue';

export default {
  components: {
    Grid,
    Operation,
    ArrowLeft,
    ArrowRight
  },
  props: {
    table: {
      type: Object,
      default: null
    },
    pagination: {
      type: Object,
      default: null
    },
    total: {
      type: Number,
      default: 0
    },
    iconVisible: {
      type: Boolean,
      default: true
    },
    indexVisible: {
      type: Boolean,
      default: false
    },
    selectionVisible: {
      type: Boolean,
      default: true
    },
    operationVisible: {
      type: Boolean,
      default: true
    },
    paginationVisible: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  emits: ['change-pagination', 'get-selected-ids', 'get-deleted-id'],
  data() {
    return {
      tableKey: 1,
      defaultProps: {
        label: 'label'
      },
      dataTotal: this.total,
      listPagination: this.pagination,
      ids: []
    };
  },
  watch: {
    pagination(val) {
      this.listPagination = val;
    },
    total(val) {
      this.dataTotal = val;
    }
  },
  methods: {
    handleDrop(draggingNode, dropNode, type) {
      return type !== 'inner';
    },
    dropOk() {
      this.tableKey++;
    },
    changeStatus(arr) {
      localStorage.setItem('logistics-column', JSON.stringify(arr));
    },
    // 获取选中的row
    handleSelectionChange(val) {
      this.ids = val.map((item) => {
        return item.id;
      });
      this.$emit('get-selected-ids', this.ids);
    },
    // 固定表格列
    toFixedPosition(str, node, table) {
      node.data.fixed = str;
      this.changeStatus(table);
    },
    // 标注异常处理情况(待处理)、获取状态(失败)和最新轨迹停留时长(>5天)
    changeContentColor(prop, val) {
      if (
        (prop === 'exception_handling_desc' && val === 10) ||
        (prop === 'sync_state_desc' && val === 20) ||
        (prop === 'stay_time' && parseFloat(val) >= 5) ||
        (prop === 'receipt_days' && val === -1) ||
        (prop === 'delivery_days' && val === -1)
      ) {
        return '#EA1D1D';
      } else if (prop === 'exception_handling_desc' && val === 0) {
        return '#D7D7D7';
      }
    },
    handleCurrentChange(val) {
      this.listPagination.current_page = val;
      this.$emit('change-pagination', this.pagination);
    },
    handleSizeChange(val) {
      this.listPagination.page_size = val;
      this.listPagination.current_page = 1;
      this.$emit('change-pagination', this.pagination);
    },
    deleteLabel(labelId, waybillId) {
      this.$emit('get-deleted-id', {
        id: waybillId,
        label_id: labelId
      });
    },
    getWidth(width) {
      if (this.type) {
        return '';
      }
      if (width) {
        return width;
      } else {
        return '200px';
      }
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

.position-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}
</style>

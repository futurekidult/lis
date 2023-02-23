<template>
  <el-container>
    <el-header class="container-header">
      <section>
        <div
          v-if="
            type === 'manage' ? menuList.length : $route.meta.tooltipVisible
          "
        >
          <el-tooltip
            v-if="show"
            :disabled="foldDisabled"
            effect="light"
            content="点击收缩"
            placement="right-start"
          >
            <el-icon
              :size="30"
              color="#fff"
              class="toggle-btn"
              @click="openCollapse('fold')"
            >
              <Fold />
            </el-icon>
          </el-tooltip>
          <el-tooltip
            v-else
            :disabled="expandDisabled"
            effect="light"
            content="点击展开"
            placement="right-start"
          >
            <el-icon
              :size="30"
              color="#fff"
              class="toggle-btn"
              @click="openCollapse('expand')"
            >
              <Expand />
            </el-icon>
          </el-tooltip>
        </div>
        <div>
          <img
            src="../../assets/images/logo.png"
            alt="load fail"
          >
        </div>
        <div class="container-project_name">
          物流管理系统 0.0.2
        </div>
      </section>
      <section>
        <el-dropdown
          style="color: #fff"
          trigger="click"
          @command="handleCommand"
        >
          <span class="user-msg">
            欢迎您,{{ $store.state.adminInfo.name }}
            <el-icon>
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </section>
    </el-header>
    <slot />
  </el-container>
</template>

<script>
import { Fold, ArrowDown, Expand } from '@element-plus/icons-vue';
export default {
  components: {
    Fold,
    Expand,
    ArrowDown
  },
  props: {
    menuList: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: ''
    }
  },
  emits: ['get-collapse'],
  data() {
    return {
      show: true,
      foldDisabled: false,
      expandDisabled: false
    };
  },
  methods: {
    openCollapse(type) {
      this.isCollapse = !this.isCollapse;
      this.$emit('get-collapse', this.isCollapse);
      if (type === 'fold') {
        this.foldDisabled = !this.foldDisabled;
      } else {
        this.expandDisabled = !this.expandDisabled;
      }
      this.show = !this.show;
    },
    async handleCommand() {
      try {
        await this.$store.dispatch('logout');
        localStorage.removeItem('logistics-token');
        window.location.href = '/';
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<style scoped>
.container-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  background-color: #3a3f4d;
}

.container-header section {
  display: flex;
  align-items: center;
}

.container-header img,
.container-header .el-icon {
  vertical-align: middle;
}

.toggle-btn {
  margin: 0 10px;
  cursor: pointer;
}

.container-project_name {
  margin: 0 20px;
  color: #fff;
  font-size: 20px;
}

.user-msg:hover {
  cursor: pointer;
}

.el-menu {
  height: 100%;
}

.el-main {
  position: relative;
  background: #f0f6f7;
  height: calc(100vh - 60px);
  padding: 14px;
}

.toggle-btn:hover,
.toggle-btn:focus {
  color: #409eff;
}

.el-menu-item.is-active {
  font-weight: 700;
  color: #409eff;
}

.el-sub-menu__title.is-active {
  font-weight: 700;
  color: #409eff;
}

.menu-icon {
  height: 18px;
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu--collapse .el-sub-menu__title span {
  display: none;
}

.el-menu--collapse .el-sub-menu .el-sub-menu__icon-arrow {
  display: none;
}
</style>

<template>
  <el-container>
    <el-header class="container-header">
      <section>
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
        <div>
          <img
            src="xx"
            alt="load fail"
          >
        </div>
        <div class="container-project_name">
          基础后台管理系统
        </div>
      </section>
      <section>
        <el-dropdown
          style="color: #fff"
          trigger="click"
        >
          <span class="user-msg">
            欢迎您,管理员
            <el-icon>
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </section>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu
          router
          text-color="#fff"
          class="el-menu-vertical"
          :default-active="$route.path"
          :collapse="isCollapse"
          background-color="#545c64"
        >
          <div
            v-for="item in menuList"
            :key="item.id"
          >
            <el-menu-item
              v-if="item.children.length === 0"
              :index="item.link"
            >
              <el-icon>
                <component
                  :is="item.icon"
                  class="menu-icon"
                />
              </el-icon>
              <template #title>
                <span>{{ item.name }}</span>
              </template>
            </el-menu-item>
            <el-sub-menu
              v-else
              :index="item.link"
              style="color: #000"
            >
              <template #title>
                <component
                  :is="item.icon"
                  class="menu-icon"
                />
                <span>{{ item.name }}</span>
              </template>
              <div
                v-for="sub in item.children"
                :key="sub.id"
              >
                <el-menu-item
                  v-if="sub.children.length === 0"
                  :index="sub.link"
                >
                  <el-icon>
                    <component
                      :is="sub.icon"
                      class="menu-icon"
                    />
                  </el-icon>
                  <template #title>
                    <span>{{ sub.name }}</span>
                  </template>
                </el-menu-item>
                <el-sub-menu
                  v-else
                  :index="sub.link"
                  style="color: #000"
                >
                  <template #title>
                    <el-icon>
                      <component
                        :is="sub.icon"
                        class="menu-icon"
                      />
                    </el-icon>
                    <span> {{ sub.name }}</span>
                  </template>
                  <el-menu-item
                    v-for="subItem in sub.children"
                    :key="subItem.id"
                    :index="subItem.link"
                  >
                    <el-icon>
                      <component
                        :is="subItem.icon"
                        class="menu-icon"
                      />
                    </el-icon>
                    <template #title>
                      <span>{{ subItem.name }}</span>
                    </template>
                  </el-menu-item>
                </el-sub-menu>
              </div>
            </el-sub-menu>
          </div>
        </el-menu>
      </el-aside>
      <el-main>
        <main-container />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  Fold,
  Expand,
  ArrowDown,
  Setting,
  Notebook,
  House
} from '@element-plus/icons-vue';
import MainContainer from './main-container.vue';

export default {
  components: {
    Fold,
    Expand,
    ArrowDown,
    Setting,
    Notebook,
    House,
    MainContainer
  },
  data() {
    return {
      show: true,
      isCollapse: false,
      foldDisabled: false,
      expandDisabled: false,
      menuList: [
        {
          name: 'Demo管理',
          link: '/demo',
          icon: 'Setting',
          collapse: 0,
          children: [
            {
              name: 'Demo列表',
              link: '/demo-list',
              icon: 'House',
              collapse: 0,
              children: []
            }
          ]
        }
      ]
    };
  },
  methods: {
    openCollapse(type) {
      this.isCollapse = !this.isCollapse;
      if (type === 'fold') {
        this.foldDisabled = !this.foldDisabled;
      } else {
        this.expandDisabled = !this.expandDisabled;
      }
      this.show = !this.show;
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
  color: #f8ba2b;
}

.el-menu-item.is-active {
  font-weight: 700;
  color: #f8ba2b;
}

.el-sub-menu__title.is-active {
  font-weight: 700;
  color: #f8ba2b;
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

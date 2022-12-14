<template>
  <base-menu
    type="manage"
    :menu-list="menuList"
    @get-collapse="getCollapse"
  >
    <el-container v-show="menuList.length">
      <el-aside width="auto">
        <el-menu
          router
          text-color="#fff"
          class="el-menu-vertical"
          :default-active="$route.path"
          :collapse="collapse"
          :default-openeds="defaultOpeneds"
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
    <el-container v-show="menuList.length === 0">
      <no-privilege />
    </el-container>
  </base-menu>
</template>

<script>
import {
  Van,
  Key,
  User,
  Place,
  SetUp,
  Setting,
  Tickets,
  House,
  Monitor,
  Calendar,
  DataLine,
  Handbag,
  CoffeeCup,
  DataAnalysis,
  TakeawayBox,
  CollectionTag,
  OfficeBuilding
} from '@element-plus/icons-vue';

import BaseMenu from './menu.vue';
import NoPrivilege from './no-privilege.vue';

export default {
  components: {
    Van,
    User,
    Key,
    Place,
    SetUp,
    House,
    Setting,
    Tickets,
    Monitor,
    Calendar,
    DataLine,
    Handbag,
    CoffeeCup,
    BaseMenu,
    NoPrivilege,
    DataAnalysis,
    TakeawayBox,
    OfficeBuilding,
    CollectionTag
  },
  data() {
    return {
      collapse: false,
      menu: this.$store.state.adminInfo.menu,
      menuList: [],
      defaultOpeneds: []
    };
  },
  watch: {
    '$store.state.adminInfo'(val) {
      this.menuList = val.menu.list;
      this.defaultOpeneds = val.menu.openeds;
    }
  },
  methods: {
    getCollapse(val) {
      this.collapse = val;
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

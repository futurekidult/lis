import { createRouter, createWebHistory } from 'vue-router';
const Manage = () => {
  return import('./components/layout/manage.vue');
};
const LogisticsList = () => {
  return import('./components/pages/logistics/logistics-list.vue');
};
const DailyStatistics = () => {
  return import(
    './components/pages/logistics/statistics/daily/daily-statistics.vue'
  );
};
const AverageStatistics = () => {
  return import(
    './components/pages/logistics/statistics/average/average-statistics.vue'
  );
};
const NotFound = () => {
  return import('./components/layout/not-found.vue');
};
const User = () => {
  return import('./components/pages/system/user.vue');
};
const Role = () => {
  return import('./components/pages/system/role.vue');
};
const Privilege = () => {
  return import('./components/pages/system/privilege.vue');
};
const Organization = () => {
  return import('./components/pages/system/organization.vue');
};
const LogisticSupplier = () => {
  return import('./components/pages/system/base/logistic-supplier.vue');
};
const overseaLocation = () => {
  return import('./components/pages/system/base/oversea-location.vue');
};
const warehouseArea = () => {
  return import('./components/pages/system/base/warehouse-area.vue');
};
const platform = () => {
  return import('./components/pages/system/base/platform.vue');
};
const label = () => {
  return import('./components/pages/system/base/label.vue');
};
const shop = () => {
  return import('./components/pages/system/base/shop.vue');
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Manage,
      redirect: '/logistics/logistics-list',
      children: [
        {
          path: '/logistics/logistics-list',
          name: 'logistics',
          component: LogisticsList,
          meta: {
            formVisible: true,
            breadcrumb: [{ title: '尾程物流管理' }, { title: '尾程物流列表' }]
          }
        },
        {
          path: '/logistics/statistics/daily-statistics',
          name: 'daily statistics',
          component: DailyStatistics,
          meta: {
            formVisible: true,
            breadcrumb: [
              { title: '尾程物流管理' },
              { title: '物流时效统计' },
              { title: '每日物流时效统计' }
            ]
          }
        },
        {
          path: '/logistics/statistics/average-statistics',
          name: 'average statistics',
          component: AverageStatistics,
          meta: {
            formVisible: true,
            breadcrumb: [
              { title: '尾程物流管理' },
              { title: '物流时效统计' },
              { title: '平均物流时效统计' }
            ]
          }
        },
        {
          path: '/system/user',
          name: 'user',
          component: User,
          meta: {
            breadcrumb: [{ title: '系统管理' }, { title: '用户管理' }]
          }
        },
        {
          path: '/system/role',
          name: 'role',
          component: Role,
          meta: {
            breadcrumb: [{ title: '系统管理' }, { title: '角色管理' }]
          }
        },
        {
          path: '/system/privilege',
          name: 'privilege',
          component: Privilege,
          meta: {
            breadcrumb: [{ title: '系统管理' }, { title: '权限管理' }]
          }
        },
        {
          path: '/system/organization',
          name: 'organization',
          component: Organization,
          meta: {
            breadcrumb: [{ title: '系统管理' }, { title: '组织管理' }]
          }
        },
        {
          path: '/system/base/logistic-supplier',
          name: 'logistic supplier',
          component: LogisticSupplier,
          meta: {
            breadcrumb: [
              { title: '系统管理' },
              { title: '基础数据' },
              { title: '物流商列表' }
            ]
          }
        },
        {
          path: '/system/base/oversea-location',
          name: 'oversea-location',
          component: overseaLocation,
          meta: {
            breadcrumb: [
              { title: '系统管理' },
              { title: '基础数据' },
              { title: '海外仓列表' }
            ]
          }
        },
        {
          path: '/system/base/warehouse-area',
          name: 'warehouse-area',
          component: warehouseArea,
          meta: {
            breadcrumb: [
              { title: '系统管理' },
              { title: '基础数据' },
              { title: '仓库分布列表' }
            ]
          }
        },
        {
          path: '/system/base/platform',
          name: 'platform',
          component: platform,
          meta: {
            breadcrumb: [
              { title: '系统管理' },
              { title: '基础数据' },
              { title: '平台列表' }
            ]
          }
        },
        {
          path: '/system/base/label',
          name: 'label',
          component: label,
          meta: {
            breadcrumb: [
              { title: '系统管理' },
              { title: '基础数据' },
              { title: '标签列表' }
            ]
          }
        },
        {
          path: '/system/base/shop',
          name: 'shop',
          component: shop,
          meta: {
            breadcrumb: [
              { title: '系统管理' },
              { title: '基础数据' },
              { title: '店铺列表' }
            ]
          }
        }
      ]
    },
    {
      path: '/:notFound(.*)',
      component: NotFound,
      meta: {
        tooltipVisible: false
      }
    }
  ]
});

export default router;

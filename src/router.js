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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Manage,
      redirect: '/system/organization',
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

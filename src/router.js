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

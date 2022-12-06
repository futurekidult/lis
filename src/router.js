import { createRouter, createWebHistory } from 'vue-router';
import Manage from './components/layout/manage.vue';
const LogisticsList = () => {
  return import('./components/pages/logistics/logistics-list.vue');
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Manage,
      redirect: '/logistics-list',
      children: [
        {
          path: '/logistics-list',
          name: 'logistics',
          component: LogisticsList,
          meta: {
            formVisible: true,
            breadcrumb: [{ title: '尾程物流管理' }, { title: '尾程物流列表' }]
          }
        }
      ]
    }
  ]
});

export default router;

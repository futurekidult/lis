import { createRouter, createWebHistory } from 'vue-router';
import GlobalData from './components/common/global-data.vue';
import Manage from './components/layout/manage.vue';
import demoList from './components/pages/demo/demo-list.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Manage,
      redirect: '/demo-list',
      children: [
        {
          path: '/demo-list',
          name: 'demo',
          component: demoList,
          meta: {
            formVisible: true,
            breadcrumb: [{ title: 'Demo管理' }, { title: 'Demo列表' }],
            chooseProperties: GlobalData.demoChooseOptions,
            editProperties: GlobalData.demoEditOptions,
            editRules: GlobalData.demoEditRules
          }
        }
      ]
    }
  ]
});

export default router;

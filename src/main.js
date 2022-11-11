import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store/index.js';
import GlobalData from './components/common/global-data.vue';
import BaseChoose from './components/common/base-choose.vue';
import BaseConfirm from './components/common/base-confirm-dialog.vue';

const app = createApp(App);

app.use(store);
app.use(router);

app.component('BaseChoose', BaseChoose);
app.component('BaseConfirm', BaseConfirm);

app.config.globalProperties.$global = GlobalData;

app.mount('#app');

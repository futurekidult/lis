import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store/index.js';
import 'element-plus/theme-chalk/el-message.css';
import GlobalData from './components/common/global-data.vue';
import BaseConfirm from './components/common/base-confirm-dialog.vue';
import BaseOption from './components/common/base-option-dialog.vue';

const app = createApp(App);

app.use(store);
app.use(router);

app.component('BaseOption', BaseOption);
app.component('BaseConfirm', BaseConfirm);

app.config.globalProperties.$global = GlobalData;

app.mount('#app');

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export default defineComponent({
  components: {
    ElConfigProvider
  },
  setup() {
    return {
      locale: zhCn
    };
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.section-border {
  border: 1px solid rgba(230, 230, 230, 1);
  background: #fff;
  padding: 10px;
  margin-bottom: 5px;
}

.el-input__wrapper {
  width: 120px !important;
}

.el-range-editor.el-input__wrapper {
  width: 250px !important;
}

.el-button {
  width: 100px;
}

.select-title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 15px;
}

.el-divider--vertical {
  border-left: 4px rgba(0, 102, 183, 1) solid !important;
}
</style>

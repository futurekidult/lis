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
  },
  mounted() {
    this.getAdminInfo();
  },
  methods: {
    async getCsrfToken() {
      try {
        await this.$store.dispatch('getCsrfToken');
      } catch (err) {
        return;
      }
    },
    async getAdminInfo() {
      try {
        this.getCsrfToken();
        await this.$store.dispatch('getAdminInfo');
      } catch (err) {
        return;
      }
    }
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

.el-input {
  width: auto !important;
}

.el-input--suffix .el-input__wrapper {
  width: 220px !important;
}

.el-select--small .el-input--suffix .el-input__wrapper {
  width: 80px !important;
}

.el-range-editor.el-input__wrapper {
  width: 222px !important;
}

.el-button {
  width: 100px;
}

.select-title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 15px;
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  color: #464646;
  margin: 40px 0 20px 0;
}

.el-divider--vertical {
  border-left: 4px rgba(0, 102, 183, 1) solid !important;
}

.el-dialog__body {
  padding-bottom: 45px !important;
}

.content-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
  width: 100%;
  font-size: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
}

.waybill-form .el-input__wrapper {
  width: 200px !important;
}

.state-city_container {
  display: flex;
}

.waybill-form .state-city_container .el-input__wrapper {
  width: 90px !important;
}

.btn-position {
  float: right;
  padding-top: 15px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
}

.position-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.icon-click {
  cursor: pointer;
}

.cue-context {
  margin-left: 80px;
  color: #a3a3a3;
  font-size: 14px;
}
</style>

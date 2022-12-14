<template>
  <base-menu type="not-found">
    <div class="content-center">
      <img src="../../assets/images/404.png">
      <div style="margin-bottom: 20px">
        您访问的页面不存在或页面出错 ~
      </div>
      <el-button
        type="primary"
        @click="toLastPage"
      >
        返回上一页
      </el-button>
    </div>
  </base-menu>
</template>

<script>
import BaseMenu from './menu.vue';
export default {
  components: {
    BaseMenu
  },
  methods: {
    toLastPage() {
      this.$router.back();
    }
  }
};
</script>

<template>
  <main>
    <base-breadcrumb />
    <router-view />
  </main>
</template>

<script>
import BaseBreadcrumb from '../common/base-breadcrumb.vue';

export default {
  components: {
    BaseBreadcrumb
  }
};
</script>

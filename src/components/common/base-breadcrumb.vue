<template>
  <section class="section-border">
    <el-breadcrumb separator="/">
      <div v-if="$route.meta.breadcrumb">
        <el-breadcrumb-item
          v-for="(item, index) in $route.meta.breadcrumb"
          :key="index"
          :to="item.link"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </div>
    </el-breadcrumb>
  </section>
</template>

<script>
export default {};
</script>

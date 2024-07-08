<template>
  <div class="app">
    <NavigatorItem></NavigatorItem>
    <!-- 路由出口 -->
    <router-view></router-view>
    <!-- 这里写插槽---插槽必须写在自定义组件中 -->
    <!-- <template v-slot:footer></template> -->
  </div>
</template>

<script setup>
import NavigatorItem from "./components/NavigatorItem.vue";
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

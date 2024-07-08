<template>
  <div class="current-weather">
    <div class="echarts h-40 mt-10">
        <!-- 这里是插槽内容---想要传递数据 -->
        <!-- 插槽行不通,试着采用路由导航的方式 -->
        <!-- <slot name="footer"></slot> -->
        <v-chart :option="option"></v-chart>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>

<!-- eslint-disable vue/multi-word-component-names -->
<!-- 遮罩层 -->
<template>
  <!-- ax-w-screen-md -->
  <div
    class="wrapper w-full h-full fixed bg-black bg-opacity-30 flex justify-center items-center z-50"
  >
    <!-- 为什么这里折线和头部标题会覆盖弹窗，添加了z-index也不行???应该是z-index的位置没有加对!! -->
    <div class="box bg-white text-black text-xs p-4 leading-5 z-50">
      <h2 class="text-lg">关于：</h2>
      <p class="mb-4">这个应用可以用来追踪你选择城市的当前天气</p>
      <h2 class="text-lg">如何使用：</h2>
      <p class="mb-4">
        1.点击搜索框输入你希望追踪的城市<br />
        2.在搜索结果中选中一个城市，你将获取当地最新的天气<br />
        3.点击右侧的＋号可以将追踪城市的天气情况保存在首页
      </p>
      <h2 class="text-lg">移除城市：</h2>
      <p class="mb-4">如果你不想在首页关注某个城市,可以通过底部的按钮删除它</p>
      <button
        class="bg-weather-secondary text-white mt-4 py-2 px-6"
        @click="closeWrapper"
      >
        关闭
      </button>
    </div>
  </div>
</template>

<script setup>
import { useWeatherStore } from "../store/index.js";
const weatherStore = useWeatherStore();

/* 定义方法 */
const closeWrapper = () => {
  weatherStore.closeWrapper();
};
</script>

<style lang="scss" scoped></style>

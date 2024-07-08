<template>
  <div class="container-item container">
    <div class="title bg-weather-secondary text-center py-2">
      <!-- 这里可以变成{{ route.query.song }}??? -->
      <span>您正在预览{{ searchCityName }}的天气信息</span>
      <span>，可以通过右上角"+"号按钮保存起来。</span>
    </div>
    <!-- 为什么这里使用border-b-white不管用??? -->
    <div class="today flex flex-col text-center gap-4 py-6 border-b-black">
      <div>当日气温是：{{ cityInstantWeather.temperature }}℃</div>
      <div>当日天气是：{{ cityInstantWeather.weather }}</div>
      <div>当日风向是：{{ cityInstantWeather.winddirection }}风</div>
      <div>当日风力是：{{ cityInstantWeather.windpower }}级</div>
    </div>
    <!-- 下划线 -->
    <hr class="border-white border-opacity-10" />

    <div
      class="current-weather bg-weather-secondary rounded pt-9 mt-2 mx-20 z-40"
    >
      <div class="flex gap-6">
        <!-- 这里引入的数据是错误的???? -->
        <div
          class="flex flex-col flex-1 gap-4 text-center px-20"
          v-for="(item, index) in cityForecastWeather"
          :key="index"
        >
          <!-- 这个地方使用的是v-for遍历吗???? -->
          <!--  v-for="(item, index) in cityForecastWeather" :key="index" -->
          <div>{{ item.week }}</div>
          <!-- 为什么cityForecastWeather里面有东西,视图中可以显示,但是在控制台中会报错??? -->
          <div>{{ item.date }}</div>
          <div>{{ item.dayweather }}</div>
          <div>风力 {{ item.daypower }}级</div>
        </div>
      </div>
      <!-- 这里是两个路由公共的部分,可以抽取出来(插槽?路由导航? ),进行传参 -->
      <div class="echarts h-40 mt-10 text-center">
        <v-chart :option="option2"></v-chart>
      </div>
      <!-- 这里使用的是插槽 -->
      <!-- <CurrentWeather>
          <template #footer>
            <v-chart :option1="option1"></v-chart>
          </template>
        </CurrentWeather> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useWeatherStore } from "../store/index.js";
const weatherStore = useWeatherStore();
import { storeToRefs } from "pinia";
// 获得路由信息
// 注意区分route和router!!!
import { useRoute } from "vue-router";
const route = useRoute();

/* 解构数据 */
// 渲染视图的实时天气和预测天气???
const { cityInstantWeather, cityForecastWeather, option2 } =
  storeToRefs(weatherStore);
const searchCityName = ref(route.query.search);
// console.log(route.params.adcode, "route.params"); //110000
// console.log(searchCityName, "route.query"); //北京市
/* 定义方法 */
// weatherStore.setTemperature();
/* 挂载 */
onMounted(async () => {
  // 这里传递的参数应该是搜索的城市编码
  await weatherStore.setInstantWeather(route.params.adcode);
  const tempTemperature2 = await weatherStore.setForecastWeather(
    route.params.adcode
  );
  // 2, 渲染表格视图
  await weatherStore.renderChart2(tempTemperature2);
  // 重新赋值城市气温
  // console.log(cityInstantWeather.value.temperature, "cityInstantWeather123");
  // weatherStore.setTemperature(cityInstantWeather.value.temperature);
});
// watch(cityInstantWeather, (newValue) => {
//   console.log(cityInstantWeather, "new----监听");
// });
</script>

<style lang="scss" scoped></style>

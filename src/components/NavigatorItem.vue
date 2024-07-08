<template>
  <!-- 这里为什么粘性定位移动后为透明的???因为没有给颜色 -->
  <!--  为什么containter之后两边有间隙???猜想是视口的原因,为什么不是100%??? -->
  <div
    class="navigator-item shadow-lg flex py-6 items-center px-40 bg-weather-primary sticky top-0 container z-10"
  >
    <div class="left flex gap-4">
      <!-- 这里使用router-link添加一个回到首页的操作!!! -->
      <router-link to="/">
        <a href="" class="icon flex gap-3 text-2xl items-center">
          <i class="fa-solid fa-sun"></i>
          <span>新中地天气</span>
        </a>
      </router-link>
      <div class="city flex gap-4 items-center">
        <span class="text-lg">{{ cityIp.city }}</span>
        <!-- <span class="text-lg">武汉市(静态)</span> -->
        <span class="text-sm">
          实时天气： {{ cityIp.weather }} {{ cityIp.temperature }}℃
        </span>
        <span class="text-sm">
          {{ cityIp.winddirection }}风{{ cityIp.windpower }}级
        </span>
      </div>
    </div>
    <div class="tips flex flex-1 justify-end gap-3">
      <!-- 这里怎样让图标垂直居中??? -->
      <!-- 这里怎么实现出现了遮罩层之后，鼠标移到i上没有hover的效果了??? -->
      <i
        class="fa-solid fa-info bg-white text-weather-primary w-5 h-5 text-center rounded-full cursor-pointer hover:bg-weather-secondary duration-1000"
        @click="toggleWrapper"
      >
        <!-- 点击i之后,实现遮罩效果 -->
        <!-- 这里怎么给遮罩效果添加duration???vue中实现动画与过渡效果使用Transition和TransitionGroup!!! -->
        <!-- 这里的遮罩效果给什么没有给头部组件添加上????因为要添加z-index提高优先级!! -->
        <teleport to="#app">
          <Transition><Wrapper v-if="isShow"></Wrapper></Transition>
        </teleport>
      </i>
      <Transition name="icon">
        <i
          class="fa-solid fa-plus text-lg cursor-pointer hover:text-weather-secondary"
          @click="localstorageCity"
          v-if="isShowCity"
        ></i>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import Wrapper from "./Wrapper.vue";
// 引入store实例--可以传递方法
import { useWeatherStore } from "../store/index.js";
// 引入storeToRefs函数---可以传递响应性数据
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";
const weatherStore = useWeatherStore();
// 获得路由信息
// 注意区分route和router!!!
import { useRoute } from "vue-router";
const route = useRoute();

/* 解构数据 */
const { isShow, cityIp, isShowCity, cityInstantWeather } =
  storeToRefs(weatherStore);
// 为什么cityIp有数据,但是cityIp.value没有数据??因为这里拿不到数据,需要watch一下获得newValue的值!!
// console.log(cityInstantWeather, "cityInstantWeather-视图");
/* 定义方法 */
// 1, 遮罩层
const toggleWrapper = () => {
  weatherStore.toggleWrapper();
};
// 2, 初始化ip的城市名称和实时天气---请求数据1,3-1
onMounted(async () => {
  await weatherStore.setIpInstantWeather();
  await weatherStore.setInstantWeather(route.params.adcode);
});
// 3, 监听+的变化
// 这里为什么刷新一下才可以显示或隐藏????
// watch(isShowCity, () => {
//   weatherStore.judgeIcon(route.params.adcode);
// });
// 4, 本地存储--先存储后重显!!
const localstorageCity = () => {
  // 这里传递了adcode和city,这里最需要获取的数据是adcode,但是可以使用city来辅助编写代码
  weatherStore.localstorageCity(route.params.adcode, route.query.search);
};
/* 这里不需要使用监听了,因为直接在store中将接口1的数据return给接口3使用了!!! */
// 3, 使用watch监听cityIp的变化
watch(cityInstantWeather, (newValue) => {
  // console.log(`城市IP地址改变了,新值是 ${newValue}，旧值是 ${oldValue}`);
  console.log(newValue, "new");
});
</script>

<style scoped>
/* 这里为什么出现的时候没有过渡效果,关闭的时候有过渡效果???因为格式写错了,把-写成了. */
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
.v-enter-active,
.v-leave-active {
  transition: all 1s ease;
}

/* 图标的过渡 */
.icon-enter-from,
.icon-leave-to {
  opacity: 0;
}
.icon-enter-to,
.icon-leave-from {
  opacity: 1;
}
.icon-enter-active,
.icon-leave-active {
  transition: all 1s ease;
}
</style>

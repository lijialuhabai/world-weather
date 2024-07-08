<template>
  <div class="search-item text-sm px-40 py-4 container">
    <div class="input mb-8">
      <!-- 这里的效果使用透明背景来完成!!! -->
      <!-- 
        这里的视图: 搜索之后,如果可以匹配上数据,在input框下面出现一个div的盒子,在div子元素中展示匹配上的数据
        如果没有匹配上,就显示'没有找到'
        点击匹配上的城市,跳转路由界面,,同时将数据赋值给第二个路由界面
        
      -->
      <input
        type="text"
        placeholder="请输入城市名称"
        class="w-full bg-transparent border-b pb-2 pl-1 outline-none focus:shadow-lg"
        v-model.trim="inputCity"
        @input="handleInput"
      />
      <!-- 这里是下拉弹窗 -->
      <!-- 这里怎么实现延迟的效果???? -->
      <Transition>
        <ul
          class="bg-weather-secondary shadow-md my-2 p-2 duration-300"
          v-if="inputCity"
        >
          <!-- <p>对不起网络似乎出了点问题 请稍后再查询</p> -->
          <p v-if="isShowNone">似乎没有找到你查找的城市</p>
          <li class="py-2 cursor-pointer" @click="searchCityContainer">
            {{ searchCity }}
          </li>
        </ul>
      </Transition>
    </div>
    <div class="list">
      <div class="text-center mb-6">
        暂时没有保存过城市天气信息,请查询后点击右上角"+"号保存。
      </div>
      <!-- 这里的group要加在外层上,group-hover要写在子元素中!!! -->
      <div class="gap-1 flex-col">
        <div
          class="flex justify-between group"
          v-for="(item, index) in saveCitysArr"
          :key="index"
        >
          <!-- 这里为什么加了duration-1000后没反应????因为要给宽度!! -->
          <div
            class="w-full flex bg-weather-secondary justify-between py-2 px-4 mb-4 cursor-pointer duration-300 group-hover:w-4/5"
          >
            <h3>{{ item.city }}</h3>
            <span>{{ cityInstantWeather.temperature }}度</span>
          </div>
          <!-- 鼠标放到这里的位置,前面的div不会变化,怎么实现????在上面那个也加上group,看做一个整体!!! -->
          <div class="hidden justify-end mb-4 gap-2 group-hover:flex">
            <button class="bg-yellow-500 w-20" @click="CheckWeather">
              查看
            </button>
            <button class="bg-yellow-500 w-20" @click="delWeather">删除</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>近期天气</span>
      <!-- 用grid布局 -->
      <div class="current-weather bg-weather-secondary rounded pt-9 mt-2">
        <div class="flex gap-6">
          <div
            class="flex flex-col flex-1 gap-4 text-center px-20"
            v-for="(item, index) in cityIpForecast"
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
        <div class="echarts h-40 mt-10 text-center z-10">
          <v-chart :option="option1"></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import CurrentWeather from "../components/CurrentWeather.vue";
import { ref, onMounted, toRaw } from "vue";
import { useWeatherStore } from "../store/index.js";
import { storeToRefs } from "pinia";
const weatherStore = useWeatherStore();

/* 解构数据 */
const {
  cityIpForecast,
  inputCity,
  option1,
  isShowNone,
  searchCity,
  cityInstantWeather,
} = storeToRefs(weatherStore);
const saveCitysArr = ref([]);

/* 定义方法 */
// 3, 相应input框的输入行为
const handleInput = () => {
  weatherStore.handleInput();
};
// 2, input框中点击城市跳转下一个路由界面的方法
const searchCityContainer = () => {
  weatherStore.searchCityContainer();
  // 实现跳转路由之后,清空input框中的内容!!
  inputCity.value = "";
  // console.log(inputCity.value,'inputCity')
};
// 3, 查看和删除的点击事件
const CheckWeather = () => {
  weatherStore.CheckWeather();
};
const delWeather = () => {
  weatherStore.delWeather();
};
/* 挂载 */
onMounted(async () => {
  // 1, 初始化ip城市的预测天气---请求数据3-2
  await weatherStore.setIpForecastWeather();
  // 2, 渲染表格视图
  await weatherStore.renderChart1();
  // 3, 渲染本地存储添加城市的温度
  saveCitysArr.value = weatherStore.saveCitysArr;
  const addCityInstantWeatherAdcode = toRaw(saveCitysArr.value).map(
    (obj) => obj.adcode
  );
  console.log(addCityInstantWeatherAdcode, "addCityInstantWeather"); //这里Adcode是一个数组???
  await weatherStore.setInstantWeather(addCityInstantWeatherAdcode);
});

/* 监听 */
// 怎么减少监听的频率??
// watch(saveCitysArr, async (newValue) => {
//   console.log(toRaw(newValue), "newValue--监听");
//   // await weatherStore.setInstantWeather(newValue);
// });
</script>

<style scoped>
/* 这里的过渡效果需要再改 ????? */
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
  transition: all 0.5s ease;
}
</style>

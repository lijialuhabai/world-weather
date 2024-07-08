/* eslint-disable no-unused-vars */
import { createApp } from "vue";
import App from "./App.vue";

import "./style.css";
// 引入fortawesome图标
import "@fortawesome/fontawesome-free/css/all.min.css";
// 接收路由
import router from "./router/index.js";

// 引入图表
// import "./plugins/vue-echarts.js";
// const app = createApp(App);
import * as echarts from "echarts";
import vueEcharts from "vue-echarts";
// 这里为什么使用app就可以引入v-chart组件????
const app = createApp(App);
app.component("v-chart", vueEcharts);

// 引入Pinia公共状态管理包
import { createPinia } from "pinia";
const pinia = createPinia();

// 引入axios包,并配置全局
import axios from "./plugins/vue-axios.js";
app.config.globalProperties.$axios = axios; //配置axios的全局引用

app.use(router).use(pinia).mount("#app");

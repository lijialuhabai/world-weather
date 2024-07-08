/* 配置路由 */
import { createRouter, createWebHistory } from "vue-router";
// 这里使用动态路由,只需要引入一个组件
import SearchItem from "../views/SearchItem.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "searchItem",
      component: SearchItem,
      meta: { title: "首页" },
    },
    {
      /* 这里需要使用动态参数进行传递!! */
      path: "/containeritem/:adcode",
      // path: "/containeritem",
      name: "containeritem",
      // 懒加载: 这里箭头函数里面需要写import(地址)!!
      component: () => import("../views/ContainerItem.vue"),
      meta: { title: "详细情况" },
    },
    /* 处理404 */
    // {
    //   path: "/404",
    //   name: "notfound",
    //   component: () => import("../views/NotFound.vue"),
    //   meta: { title: "404" },
    // },
    /* 这里直接使用重定向写,不用处理404 */
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ],
});

export default router;

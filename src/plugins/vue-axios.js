// 引入并二次封装axios包
import axios from "axios";

const API = axios.create({
  baseURL: "https://restapi.amap.com/v3",
  timeout: 2000,
});

export default API;

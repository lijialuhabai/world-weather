/* 这里因为请求数据的连接里需要用到这里定义的数据,故放到这里store中 */

/* 这里发送具体的axios请求 */
import request from "../plugins/vue-axios.js";
// 引入store实例--可以传递方法
// import { useWeatherStore } from "../store/index.js";
// // 引入storeToRefs函数---可以传递响应性数据
// import { storeToRefs } from "pinia";
// const weatherStore = useWeatherStore();

/* 解构数据 */
// 试着用一用传参address,和citycode

// const address = "北京市";
// const { cityIp } = storeToRefs(weatherStore);
const key = "7ee366c32786619f0829f137c14424ef";
const extensions = "all";

/* 定义方法 */
// 接口1: 默认ip => 本地adcode
export const getIpToAdcode = () => {
  // "/ip?key=7ee366c32786619f0829f137c14424ef"
  return request.get(`/ip?`, { params: { key } });
};

// 接口2: 城市名称 => 本地adcode
export const getCityNameToAdocode = (address) => {
  // /geocode/geo?address=北京市&key=7ee366c32786619f0829f137c14424ef
  return request.get(`/geocode/geo?`, { params: { address, key } });
};

// 接口3-1: 本地adcode => 天气(实时)
// 这里需要注意接口传递参数的名称!!!!
export const getInstantWeather = async (city) => {
  //   await weatherStore.setCityIp(); //这里需要先等待数据加载完成之后!!
  //   const city = cityIp.value.adcode;
  // console.log(city, "adcode"); //有值了
  // `/weather/weatherInfo?city=42100&key=7ee366c32786619f0829f137c14424ef`
  return request.get(`/weather/weatherInfo?`, { params: { city, key } });
};

// 接口3-2: 本地adcode => 天气(预测)
export const getForecastWeather = async (city) => {
  //   await weatherStore.setCityIp();
  //   // 函数里面有局部作用域,所以不能访问上面函数中定义的数据,怎么访问(只需定义一次city)????
  //   const city = cityIp.value.adcode;
  // console.log(city, "city-forecast");
  // /weather/weatherInfo?&city=420100&key=7ee366c32786619f0829f137c14424ef&extensions=all
  return request.get(`/weather/weatherInfo?`, {
    params: { city, key, extensions },
  });
};

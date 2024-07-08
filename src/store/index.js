/* 配置Pinia的公共状态 */
import { defineStore } from "pinia";
import { ref } from "vue";
// import request from "../plugins/vue-axios.js";
import {
  getIpToAdcode,
  getCityNameToAdocode,
  getInstantWeather,
  getForecastWeather,
} from "../api/index.js";
// 路由传参
import { useRouter } from "vue-router";

/* 函数形式创建store实例 */
export const useWeatherStore = defineStore("weather", () => {
  /* 头部组件NavigatorItem中 */
  // 1, 遮罩层
  const isShow = ref(false);
  const toggleWrapper = () => {
    // isShow.value = !isShow.value;
    isShow.value = true;
  };
  // 2, 初始化ip地址的城市名称---请求数据1
  // 这里可以不用定义cityIp,直接通过ip获取adcode,给接口3进行赋值!!!
  // 城市的名称可以在接口3中进行获取!!!
  // 这个地方为什么在函数里面是可以获取数据,但是在外面不能获取数据????因为异步,怎么解决???使用异步再调用一次setCityIp()这个方法!!
  // console.log(cityIp.value, "cityIp-props"); //无数据
  const setCityIp = async () => {
    const res = await getIpToAdcode();
    // console.log(res.data.adcode, "res-ip"); //有数据
    // cityIp.value = res.data;
    // console.log(cityIp.value, "cityIp-fn"); //有数据
    const citycode = res.data.adcode;
    return citycode;
  };

  // 3, 初始化ip城市的实时天气---请求数据3-1
  const cityIp = ref({});
  const setIpInstantWeather = async () => {
    const citycode = await setCityIp();
    // console.log(citycode, "citycode-instant"); //420100
    const res = await getInstantWeather(citycode);
    // console.log(res.data.lives[0], "res-ip-instant");
    cityIp.value = res.data.lives[0];
  };
  //4, 初始化ip城市的预测天气---请求数据3-2
  const cityIpForecast = ref({});
  const setIpForecastWeather = async () => {
    const citycode = await setCityIp();
    // console.log(citycode, "citycode-forecast"); //420100
    const res = await getForecastWeather(citycode);
    // console.log(res.data.forecasts[0].casts, '"res-ip-forecast"');
    // 这里需要处理一下原始的数据
    cityIpForecast.value = res.data.forecasts[0].casts.map((item) => {
      // console.log(item.week, "item");
      return {
        week: formatterWeek(item.week - 1),
        date: item.date.slice(5),
        dayweather: item.dayweather,
        daypower: item.daypower,
        daytemp: item.daytemp,
        nighttemp: item.nighttemp,
      };
    });
    // 定义一个临时变量,传递给渲染图表的函数中
    const tempTemperature = cityIpForecast.value;
    return tempTemperature;
  };

  /* 初始化星期的显示!! */
  function formatterWeek(weekdayNumber) {
    // 检查输入的weekdayNumber是否在有效范围内
    if (weekdayNumber < 0 || weekdayNumber > 6) {
      throw new Error("weekdayNumber must be between 0 and 6");
    }
    // 定义星期名称数组
    const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    // 获取当前日期
    const today = new Date();
    // 获取当前星期几（0代表周一，1代表周二，以此类推）
    const currentWeekday = today.getDay();
    // 根据weekdayNumber返回相应的星期名称
    // 如果weekdayNumber为0或1，则返回"今天"或"明天"
    if (weekdayNumber + 1 === currentWeekday) {
      return "今天";
    } else if (weekdayNumber + 1 === (currentWeekday + 1) % 7) {
      return "明天";
    } else {
      return weekdays[weekdayNumber];
    }
  }

  // 5, 渲染图表
  const option1 = ref({});
  const renderChart1 = async () => {
    const tempTemperature = await setIpForecastWeather();
    // console.log(tempTemperature, "tempTemperature");
    // 这里怎么将一个数组中的每个对象的第一个值拿出来返回一个新的数据??通过map函数返回新数组!!
    const chartDaytemp = tempTemperature.map((item) => item.daytemp);
    // console.log(chartDaytemp, "chartDaytemp"); //['22', '26', '25', '27']
    const chartNightTemp = tempTemperature.map((item) => item.nighttemp);
    // console.log(chartNightTemp, "chartNightTemp"); //['15', '16', '18', '19']
    option1.value = {
      xAxis: {
        type: "category",
        show: false,
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          type: "line",
          data: chartDaytemp,
          smooth: true,
          label: {
            show: true,
            // 文字在折线上面显示
            position: "top",
            fontSize: 12,
            color: "white",
            formatter(params) {
              return `白${params.data}℃`;
            },
          },
        },
        {
          type: "line",
          data: chartNightTemp,
          smooth: true,
          label: {
            show: true,
            position: "bottom",
            fontSize: 12,
            color: "white",
            formatter(params) {
              return `晚${params.data}℃`;
            },
          },
        },
      ],
      grid: {
        top: 18,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
  };

  /* 遮罩层组件Wrapper中 */
  const closeWrapper = () => {
    isShow.value = false;
  };

  /* ================================================================== */

  /* 路由组件1SearchItem中 */
  const inputCity = ref("");
  const isShowNone = ref(false); //控制没找的数据的显示和隐藏
  const searchAdcode = ref(""); //搜索城市的adcode
  const searchCity = ref(""); //搜索城市的名称
  // 1, 获得input框中输入的数据,找到该城市的adcode---请求数据2
  // 2, 为input框绑定事件
  // 这里的逻辑:获取到input框中输入的内容
  // 一、如果接口的city数据中包含inputCity的数据,将接口中的Adcode赋值给cityAdcode
  // 二、再调用接口3,将cityAdcode赋值给city,获得搜索城市的实时和预测数据
  const handleInput = async () => {
    const address = inputCity.value;
    // console.log(address,'输入了')
    const res = await getCityNameToAdocode(address);
    // console.log(res.data.status, "res-search");
    // 需要判断一下请求的地址对不对
    // 这里为什么没有执行???这里需要让数值的0变成字符串的0!!!
    if (res.data.status === "0") {
      isShowNone.value = true;
      // 这里输入`北京`之后又删除成`北`,视图中应该变成找不到该数据!!
      searchCity.value = "";
      return;
    }
    console.log(isShowNone.value, "isShowNone.value");
    if (res.data.status === "1") {
      // 如果请求的地址正确,那就对比一下输入内容和cityname,返回adcode
      // 怎么写包含关系???使用slice()去掉'市'
      if (
        address ===
          res.data.geocodes[0].city.slice(
            0,
            res.data.geocodes[0].city.length - 1
          ) ||
        address === res.data.geocodes[0].city
      ) {
        searchAdcode.value = res.data.geocodes[0].adcode;
        searchCity.value = res.data.geocodes[0].city;
        isShowNone.value = false;
        // console.log(searchAdcode.value, "searchAdcode"); //string类型
        // console.log(searchCity.value, "searchCity");
      }
    }
  };

  // 3, 点击input中搜索的城市,可以跳转到下一个路由界面
  // 这里路由前面用的是动态参数params,后面用的是查询参数query????
  const router = useRouter();
  const searchCityContainer = () => {
    // 这里面110000和北京市都是拼接的????
    // router.push(`/containeritem/110000?search=北京市`)
    router.push({
      name: "containeritem",
      // 这个地方动态参数需要在index里面挂载一下
      params: {
        adcode: searchAdcode.value,
      },
      query: {
        search: searchCity.value,
      },
    });
  };

  // 4, 搜索城市的实时天气---请求数据3-1
  const cityInstantWeather = ref({});
  const setInstantWeather = async (adcode) => {
    // console.log(adcode,'searchAdcode')
    const res = await getInstantWeather(adcode);
    // console.log(res, "res-instant-search");
    if (res.data.lives) cityInstantWeather.value = res.data.lives[0];
    // console.log(cityInstantWeather.value, "cityInstantWeather.value");
  };
  // 5, 搜索城市的预测天气---请求数据3-2
  const cityForecastWeather = ref({});
  // 怎么在外面获取到数据???需要在视图中监听!!!!
  const setForecastWeather = async (adcode) => {
    const res = await getForecastWeather(adcode);
    // console.log(res.data.forecasts[0].casts, "res-city-Forecast-search");
    cityForecastWeather.value = res.data.forecasts[0].casts.map((item) => {
      // console.log(item, "item-search");
      return {
        week: formatterWeek(item.week - 1),
        date: item.date.slice(5),
        dayweather: item.dayweather,
        daypower: item.daypower,
        daytemp: item.daytemp,
        nighttemp: item.nighttemp,
      };
    });
    // console.log(cityForecastWeather.value, "cityForecastWeather"); //有数据,还是异步的问题!!
    // 定义一个临时变量,传递给渲染图表的函数中
    const tempTemperature2 = cityForecastWeather.value;
    return tempTemperature2;
  };
  // 6, 渲染图表-路由的第二个界面
  /* 这部分可以优化,使用传参实现!!! */
  const option2 = ref({});
  const renderChart2 = async (tempTemperature2) => {
    // console.log(tempTemperature2, "tempTemperature");
    // // 这里怎么将一个数组中的每个对象的第一个值拿出来返回一个新的数据??通过map函数返回新数组!!
    const chartDaytemp = tempTemperature2.map((item) => item.daytemp);
    // console.log(chartDaytemp, "chartDaytemp"); //['25', '29', '28', '25']
    const chartNightTemp = tempTemperature2.map((item) => item.nighttemp);
    // console.log(chartNightTemp, "chartNightTemp"); //['14', '16', '16', '15']
    option2.value = {
      xAxis: {
        type: "category",
        show: false,
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          type: "line",
          data: chartDaytemp,
          smooth: true,
          label: {
            show: true,
            // 文字在折线上面显示
            position: "top",
            fontSize: 12,
            color: "white",
            formatter(params) {
              return `白${params.data}℃`;
            },
          },
        },
        {
          type: "line",
          data: chartNightTemp,
          smooth: true,
          label: {
            show: true,
            position: "bottom",
            fontSize: 12,
            color: "white",
            formatter(params) {
              return `晚${params.data}℃`;
            },
          },
        },
      ],
      grid: {
        top: 18,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
  };

  // 7,本地存储---这里的逻辑应该写在页面当中??
  const saveCityList = ref([]);
  const isShowCity = ref(true); //控制+的显示与隐藏(如果本地中有,就为false,没有为true)
  // const temperature = ref("");
  // 在store中存储一份实时温度
  // 这里为什么是空值???
  // const setTemperature = (t) => {
  //   temperature.value = t;
  // };

  // 这里需要把字符串转成数组的形式,使用JSON.parse()!!
  // const keyArr = ref(JSON.parse(localStorage.getItem("saveCity")));
  // console.log(keyArr, "keyArr.value");
  /* 判断+的true和false */
  // const judgeIcon = (adcode) => {
  //   console.log("已经执行了");
  // };
  /* 本地存储 */
  let saveCitysArr = ref([]);
  const localstorageCity = (adcode, city) => {
    //将当前页面的adcode存储起来
    // 这里的逻辑: 希望可以在一个数组中,如果数组存在,在里面push,如果数组不存在,给他赋值
    saveCitysArr.value = JSON.parse(localStorage.getItem("savedCity"));
    if (saveCitysArr.value) {
      saveCitysArr.value.push({ adcode, city });
    } else {
      saveCitysArr.value = [{ adcode, city }];
    }
    localStorage.setItem("savedCity", JSON.stringify(saveCitysArr.value));

    /* 重新渲染显示,拿数据??? */

  };
  /* 生成随机的8位字母和数字 */
  function generateRandomString() {
    let randomString = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return randomString;
  }
  /* 重新渲染视图,从本地存储中拿到数据进行渲染 */
  function displayList() {
    //
  }
  displayList();

  // 8, 查看和删除的点击事件
  const CheckWeather = (item) => {
    // 查看的逻辑--重新调用跳转路由传参的函数
    searchCityContainer(item);
  };
  const delWeather = () => {
    // 删除改行和本地存储
  };
  return {
    /* 头部+路由1 */
    isShow,
    toggleWrapper,
    setCityIp,
    cityIp,
    setIpInstantWeather,
    cityIpForecast,
    setIpForecastWeather,
    cityInstantWeather,
    setInstantWeather,
    option1,
    renderChart1,

    /* 遮罩层 */
    closeWrapper,

    /* 路由2 */
    cityForecastWeather,
    setForecastWeather,
    inputCity,
    isShowNone,
    searchAdcode,
    searchCity,
    handleInput,
    option2,
    renderChart2,

    /* 本地存储 */
    isShowCity,
    saveCitysArr,
    // setTemperature,
    // judgeIcon,
    localstorageCity,
    CheckWeather,
    searchCityContainer,
    delWeather,
  };
});

<template>
  <div>
    <input v-model="newObject.name" placeholder="对象名称" />
    <button @click="addObject">添加对象</button>
    <ul>
      <li v-for="(obj, index) in storedObjects" :key="index">
        {{ obj.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newObject: { name: "" },
      storedObjects: [],
    };
  },
  created() {
    // 尝试从localStorage加载已存储的对象
    const storedData = localStorage.getItem("myObjects");
    if (storedData) {
      this.storedObjects = JSON.parse(storedData);
    }
  },
  methods: {
    addObject() {
      // 将新对象添加到storedObjects数组中
      this.storedObjects.push({ ...this.newObject });
      this.newObject.name = ""; // 重置输入框

      // 将数组转换为JSON字符串并存储到localStorage
      localStorage.setItem("myObjects", JSON.stringify(this.storedObjects));
    },
  },
  beforeDestroy() {
    // 在组件销毁前，确保将最新数据存回localStorage
    localStorage.setItem("myObjects", JSON.stringify(this.storedObjects));
  },
};

// 本地存储
const localstorageCity = (adcode, city) => {
  console.log(adcode, "-adcode", city, "-city");
  const params = { adcode, city };
  // 重新加载本地数据

  // displayList();
  /* 这里应该还有一个逻辑,如果加过了,就不能重复加????---这里使用isShowCity来控制+的显示与隐藏!! */

  // 这里重新加载之后就会覆盖???????
  // 这个地方的参数和setItem的参数是不一样的!!!!!!!
  saveCityList.value.push(params);
  // console.log(saveCityList, "saveCityList.value");
  // 这个地方会直接把adcode给覆盖掉???需要加一个索引!!!//或者数组的在后面添加一个对象!!!!
  localStorage.setItem("saveCity", JSON.stringify(saveCityList.value));
  return params;
};
</script>

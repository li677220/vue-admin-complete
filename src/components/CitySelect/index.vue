<template>
<div style="overflow: hidden;">
  <el-row :gutter="10">
    <el-col :span="6">
      <el-select v-model="currentData.province" @change="changePro">
        <el-option
          v-for="item in data.province"
          :key="item.PROVINCE_CODE"
          :label="item.PROVINCE_NAME"
          :value="item.PROVINCE_CODE">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-select v-model="currentData.city" @change="changeCity">
        <el-option
          v-for="item in data.city"
          :key="item.CITY_CODE"
          :label="item.CITY_NAME"
          :value="item.CITY_CODE">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-select v-model="currentData.area"  @change="changeArea">
        <el-option
          v-for="item in data.area"
          :key="item.AREA_CODE"
          :label="item.AREA_NAME"
          :value="item.AREA_CODE">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-select v-model="currentData.street">
        <el-option
          v-for="item in data.street"
          :key="item.STREET_CODE"
          :label="item.STREET_NAME"
          :value="item.STREET_CODE">
        </el-option>
      </el-select>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { GetCity } from "@/api/common.js"
import { onMounted, reactive } from '@vue/composition-api'
export default {
setup(props,context){
  const data = reactive({
    province: [],
    city: [],
    area: [],
    street: []
  })
  const currentData = reactive({
    province: "",
    city: "",
    area: "",
    street: ""
  })
  const resetCurrentData = () => {
    for(var item in currentData){
      currentData[item] = ""
    }
  }
  const getProvince = () => {
    GetCity({type: "province"}).then(res => {
      let resData = res.data.data.data
      data.province = resData
    }).catch(err => {
      console.log(err);
    })
  }
  // 省份改变 清空市、区、街道 获取新的市
  const changePro = (val) => {
    currentData.city = "",
    currentData.area = "",
    currentData.street = ""
    GetCity({
      type: "city",
      province_code: currentData.province
    }).then(res => {
      let resData = res.data.data.data
      data.city = resData
      console.log(resData);
    }).catch(err => {
      console.log(err);
    })
  }
  // 城市改变 清空区、街道 获取新的区/县
  const changeCity = () => {
    currentData.area = "",
    currentData.street = ""
    GetCity({
      type: "area",
      city_code: currentData.city
    }).then(res => {
      let resData = res.data.data.data
      data.area = resData
      console.log(resData);
    }).catch(err => {
      console.log(err);
    })
  }
  // 区/县改变 清空街道 获取新的街道
  const changeArea = () => {
    currentData.street = ""
    GetCity({
      type: "street",
      area_code: currentData.area
    }).then(res => {
      let resData = res.data.data.data
      data.street = resData
      console.log(resData);
    }).catch(err => {
      console.log(err);
    })
  }
  const getAddress = () => currentData
  onMounted(() => {
    getProvince()
  })
  return{
    data,currentData,
    getProvince,changePro,changeCity,changeArea,getAddress,resetCurrentData
  }
}
}
</script>

<style lang='scss' scoped>
</style>

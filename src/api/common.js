import { GetCategory, GetCategoryAll } from "@/api/news";
import service from "@/utils/request"
import { reactive } from "@vue/composition-api"
export function common(){
  const categoryInfo = reactive({
    item: []
  })
  const getInfoCategory = () => {
    GetCategory().then(response => {
      categoryInfo.item = response.data.data.data
    }).catch(err => {
      console.log(err);
    })
  }
  const getInfoCategoryAll = () => {
    GetCategoryAll().then(response => {
      categoryInfo.item = response.data.data
    }).catch(err => {
      console.log(err);
    })
  }
  return{
    categoryInfo,getInfoCategory,getInfoCategoryAll
  }
}
/**
 * 获取七牛Token
 */
export function GetQiniuToken(data){
  return service.request({
    method: "POST",
    url: "/uploadImgToken/",
    data
  })
}
/**
 * 获取省市区
 */
export function GetCity(data){
  return service.request({
    method: "POST",
    url: "/cityPicker/",
    data
  })
}
import { reactive } from '@vue/composition-api'
import { GetUserList } from "@/api/user.js"

export function loadData(){
  const tableData = reactive({
    item: [],
    total: 0
  })
  const loadingData = (params) => {
    GetUserList(params).then(res => {
      let resData = res.data.data
      tableData.item = resData.data
      // tableData.total = resData.data.length > 10 ? resData.total : resData.data.length
      tableData.total = resData.total
    }).catch(err => {
      console.log(err);
    })
  }
  return{
    tableData, loadingData
  }
}
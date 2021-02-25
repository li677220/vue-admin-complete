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
      tableData.total = resData.total
      console.log(tableData);
    }).catch(err => {
      console.log(err);
    })
  }
  return{
    tableData, loadingData
  }
}
import { reactive, watch } from "@vue/composition-api"
import { loadData } from "./loadData"
const { tableData, loadingData } = loadData()
export function pagination() {

  const pageData = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 30, 40]
  })
  const handleSizeChange = val => {
    pageData.pageSize = val
    loadingData({
      pageNumber: pageData.currentPage,
      pageSize: pageData.pageSize
    })
  }
  const handleCurrentChange = val => {
    pageData.currentPage = val
    loadingData({
      pageNumber: pageData.currentPage,
      pageSize: pageData.pageSize
    })
  }
  return{
    pageData, handleSizeChange, handleCurrentChange
  }
}
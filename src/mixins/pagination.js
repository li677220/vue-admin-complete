
let pagination = {
  data(){
    return{
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40]
      }
    }
  },
  created(){},
  mounted(){},
  methods: {
    handleSizeChange(val) {
      this.pageData.pageSize = val
      this.getTableData({
        pageNumber: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      })
    },
    handleCurrentChange(val) {
      this.pageData.currentPage = val
      this.getTableData({
        pageNumber: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      })
    }
  }
}
export default pagination
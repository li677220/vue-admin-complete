import { GetUserList } from "@/api/user.js"

let tableLoadData = {
  data(){
    return{

    }
  },
  created(){

  },
  mounted(){
    this.getTableData({
      pageNumber:1,
      pageSize:10
    })
  },
  methods: {
    getTableData(params){
      GetUserList(params).then(res => {
        let resData = res.data.data
        this.data.tableData.item = resData.data
        this.pageData.total = resData.total
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
export default tableLoadData
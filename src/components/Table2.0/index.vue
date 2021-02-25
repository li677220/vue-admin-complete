<template>
<div>
  <el-table :data="data.tableData.item" border style="width: 100%">
    <el-table-column type="selection" width="55" v-if="data.configTable.selection"></el-table-column>
    <template v-for="(item,i) in data.configTable.tHead">
      <el-table-column :key="i" v-if="item.columnType === 'slot'" :prop="item.field" :label="item.label" :width="item.width">
        <template v-slot="scope">
          <slot :name="item.slotName" :data="scope.row"></slot>
        </template>
      </el-table-column>  
      <el-table-column :key="i" :prop="item.field" :label="item.label" :width="item.width" v-else></el-table-column>  
    </template>
  </el-table>
  <el-pagination
    v-if="data.configTable.pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageData.currentPage"
    :page-sizes="pageData.pageSizes"
    :page-size="pageData.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pageData.total" background>
  </el-pagination>
</div>
</template>
<script>
// import { loadData } from "./loadData"
// import { pagination } from "./pagination"
import tableLoadData from "@/mixins/tableLoadData.js"
import pagination from "@/mixins/pagination.js"
export default {
  /**
   * 此界面为2.0写法，配合@/mixins/tableLoadData.js文件一起达到3.0的效果
   * 如果一个混入组件在页面使用了两次 则会出现问题  因为无法区分到底是哪一个
   * 但是3.0可以重命名，解决了这个问题
   * 混入：
   *    1、混入的data中，键名相同，则读取组件中的键名，反之读取混入键名
   *    2、钩子：同名钩子函数将混合为一个数组，因此都将被调用，混入对象的钩子在组件自身钩子之前调用
   *    3、值为对象的混入：如methods、components等，选项会被合并，组件对象覆盖混入对象
   */
props: {
  config: {
    type: Object,
    default: () => {}
  }
},
mixins: [tableLoadData, pagination],
data(){
  return{
    data: {
      tableData: [],
      configTable: {
        selection: true,
        // requestUrl: "",
        tHead: [],
        pagination: true
      }
    },
  }
},
methods: {
  initThead(){
    this.data.configTable = this.config
  }
},
beforeMount(){
  this.initThead()
},
// setup (props,context) {
//   const { tableData, loadingData } = loadData()
//   const { pageData, handleSizeChange, handleCurrentChange } = pagination()
//   // 初始加载10条数据
//   loadingData({
//     pageNumber:1,
//     pageSize:10
//   })
//   const data = reactive({
//     tableData: [],
//     configTable: {
//       selection: true,
//       // requestUrl: "",
//       tHead: [],
//       pagination: true
//     }
//   })
//   // 监听表格数据
//   watchEffect(() => {
//     // 更新页码
//     pageData.total = tableData.total
//   })
//   //监听父组件传入的表头数据
//   watch([
//     () => props.config,
//     () => tableData.item
//     ], ([config,item]) => {
//       data.configTable = config //更新表头
//       data.tableData = item //更新数据
//     },{
//     immediate: true //初次加载时是否监听（绑定时加载）
//   })
//   return {
//     data, pageData,
//     handleSizeChange, handleCurrentChange
//   }
// },
}
</script>

<style lang='scss' scoped>
.el-pagination{
  padding-right: 0;
  float: right;
  margin-top: 15px;
}
 
</style>

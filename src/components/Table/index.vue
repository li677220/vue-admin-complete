<template>
<div>
  <el-table :data="data.tableData" border style="width: 100%" v-loading="config.load" @selection-change="handleSelectionChange">
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
  <div class="footer">
    <el-button size="mini" @click="batchRemove()" class="full-left">批量删除</el-button>
    <!-- <template v-slot="scope">
      <slot :name="item.slotName" :data="scope.row"></slot>
    </template> -->
    <el-pagination
      v-if="data.configTable.pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageData.currentPage"
      :page-sizes="pageData.pageSizes"
      :page-size="pageData.pageSize"
      class="full-right"
      layout="sizes, prev, pager, next, jumper"
      :total="pageData.total" background>
    </el-pagination>
  </div>
  
</div>
</template>
<script>
import { onMounted, reactive, watch, watchEffect, computed } from '@vue/composition-api'
import { loadData } from "./loadData"
import { pagination } from "./pagination"
import { allRoles, allSystem } from "@/assets/role/role.js"
import { allAddress } from "@/assets/address/city.js"
import { DeleteUser, GetUserList } from "@/api/user.js"
import { global } from "@/utils/globalv3.js"
export default {
props: {
  config: {
    type: Object,
    default: () => {}
  }
},
setup (props,context) {
  // const { tableData } = loadData()
  // const { pageData, handleSizeChange, handleCurrentChange } = pagination()
  const { removeTips } = global();
  console.log(allRoles,allSystem);
  const data = reactive({
    tableData: [],
    // configTable: {
    //   selection: true,
    //   // requestUrl: "",
    //   tHead: [],
    //   pagination: true
    // }
    configTable: computed(() => {
      return props.config
    })
  })
  let selectData = reactive({
    // 选中数据的id
    item: []
  })
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
  // 监听表格数据 
  // watchEffect(() => {
  //   // 更新页码(后端返回的页码存在问题，暂时取消页码总计的显示)
  //   pageData.total = tableData.total
  // })
  //监听父组件传入的表头数据
  // watch(() => tableData,(newVal,oldVal) => {
  //   data.tableData = newVal.item
  //   console.log(newVal.item,oldVal.item);
  // },{
  //   deep: true
  // })
  // watch(() => tableData.item , (newItem,oldItem) => {
  //     data.tableData = newItem 
  //     console.log(data);//(第二次变化监听不到,将分离出去的表格数据重新拿到当前页面（曲线救国）)
  //   },{
  //   // immediate: true, //初次加载时是否监听（绑定时加载）
  //   deep: true
  // })
  const batchRemove = () => {
    if(selectData.item.length == 0){
      context.root.$message({
        message: "未选中任何内容",
        type: "warning"
      })
      return false
    }
    removeTips({
      value: "确认删除当前信息",
      fn: confirm
    })
  }
  const confirm = () => {
    let removeIds = []
    // selectData.item.forEach(item => {
    //   removeIds.push(item.id)
    // })
    removeIds = selectData.item.map(item => item.id)
    let reqData = {
      id: removeIds 
    }
    DeleteUser(reqData).then(res => {
      getList()
    }).catch(err => {
      console.log(err);
    })
  }
  const handleSelectionChange = (val) => {
    selectData.item = val
  }
  const getList = () => {
    let reqData = {
      pageNumber:1,
      pageSize:10
    }
    loadingData(reqData)
    props.config.load = false
  }
  const loadingData = (params) => {
    GetUserList(params).then(res => {
      let resData = res.data.data
      formatRole(resData.data)
      formatAddress(resData.data)
      // let resData = formatRole(res.data.data.data)
      data.tableData = resData.data
      // tableData.total = resData.data.length > 10 ? resData.total : resData.data.length
      pageData.total = resData.total
    }).catch(err => {
      console.log(err);
    })
  }
  // 地区和时间默认以json格式显示，需要格式化
  const formatAddress = (data) => {
    for(let i in data){
      // console.log(typeof(JSON.parse(data[i].region)));
      data[i].region = JSON.parse(data[i].region)
      // console.log(data[i].region);
      let resoult = ""
      allAddress.filter(item => {
        if(item.PROVINCE_CODE == data[i].region.province){
          resoult = item.PROVINCE_NAME
          item.children.filter(item => {
            if(resoult == item.CITY_NAME){
              resoult += ""
              // break
              return
            }
            if(item.CITY_CODE == data[i].region.city){
              resoult += "-"+item.CITY_NAME
            }
          })

        }
      })
      // let province = allAddress.filter(item => {
      //   return item.PROVINCE_CODE == data[i].region.province
      // })
      // let city = province.children.filter(item => {
      //   return item.CITY_CODE == data[i].region.city
      // })
      data[i].region = resoult
    }
  }
  const formatRole = (data) => {
    for(let i in data){
      let role = allRoles.filter(item => {
        return item.role == data[i].role
      })[0].name
      data[i].role = role
    }
  }
  onMounted(() => {
    getList()
  })
  return {
    data, pageData,
    // methods
    handleSizeChange, handleCurrentChange,batchRemove,handleSelectionChange,
    getList,loadingData
  }
},
}
</script>

<style lang='scss' scoped>
.el-pagination{
  padding-right: 0;
}
.footer{
  margin-top: 15px;
}
</style>

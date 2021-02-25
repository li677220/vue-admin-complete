<template>
  <div id="infoIndex">
    <el-row :gutter="20">
      <el-col :span="4">
        <label for="">
          <span class="label-value">类型:</span>
          <el-select v-model="searchOptions.typeValue" placeholder="请选择" style="max-width: 120px">
            <el-option
              v-for="item in options.item"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <SelectCmp :config="configOptions"/> -->
        </label>
      </el-col>
      <el-col :span="7">
        <label for="">
          <span class="label-value">日期:</span>
            <el-date-picker
              v-model="searchOptions.dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-M-d HH:mm:ss"
              style="max-width: 280px"
            >
            </el-date-picker>
        </label>
      </el-col>
      <el-col :span="7">
        <label for="">
          <span class="label-value">关键字:</span>
          <el-select v-model="searchOptions.keyValue" placeholder="请选择" style="max-width: 120px">
            <el-option
              v-for="item in keyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input v-model="searchOptions.inputValue" placeholder="请输入"
          class="full-right" style="max-width: 140px"></el-input>
        </label>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" class="full-left" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" class="full-right" icon="el-icon-plus" @click="addNews">新增</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData.item" border style="width: 100%"
    v-loading="tableData.loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="标题" ></el-table-column>
      <el-table-column prop="categoryName" label="类型" width="130"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="240" :formatter="formatTime"></el-table-column>
      <el-table-column prop="manager" label="管理人" width="115"></el-table-column>
      <el-table-column prop="operation" label="操作" width="240">
        <template v-slot="scope">
          <el-button type="danger" size="mini" @click="deleteInfo(scope.row.id)">删除</el-button>
          <el-button type="success" size="mini" @click="editDetails(scope.row)">编辑详情</el-button>
          <el-button type="success" size="mini" @click="editNews(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="10" class="page-foot">
      <el-col :span="2" class="full-left batch">
        <el-button size="mini" @click="removeAllNews">批量删除</el-button>
      </el-col>
      <el-col :span="14" class="full-right paging">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗 -->
    <dialogInfo ref="addDialog" @getList="getList" :category="options.item" title="新增"></dialogInfo>
    <dialogInfo ref="editDialog" @getList="getList" :category="options.item" title="编辑"></dialogInfo>
  </div>
</template>

<script>
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import SelectCmp from "@/components/Select/index.vue"
import { formatDate } from "@/utils/common.js"
import { common } from "@/api/common.js"
import { global } from "@/utils/globalv3.js"
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
// import dialogInfo from "./dialog/index"
export default {
  name: "InfoIndex",
  components: { dialogInfo:resolve => {
    require(['./dialog/index.vue'],resolve)
    }, SelectCmp
  },
  setup(props, { refs, root }) {
    const { categoryInfo, getInfoCategory, getInfoCategoryAll } = common();
    const { removeTips } = global();
    const keyOptions = reactive([
      {
        value: "id",
        label: "ID"
      },{
        value: "title",
        label: "标题"
      }
    ])
    let options = reactive({
      item: []
    });
    const configOptions = reactive({
      // 下拉框需要的内容
      options:["id","title"]
    })
    const searchOptions = reactive({
      typeValue: "",
      dateValue: "",
      keyValue: "id",
      inputValue: ""
    })
    const tableData = reactive({
      item: [],
      total: 0,
      loading: true
    })
    const pageObj = reactive({
      size: 10 ,
      current: 1 
    })
    // 待删除的信息id
    const deleteIds = reactive({
      id: []
    })
    
    const handleSizeChange = val => {
      pageObj.size = val
      console.log(pageObj);
    }
    const handleCurrentChange = val => {
      pageObj.current = val
      getList() //页码改变后 更新列表
    }
    const addNews = () => {
      refs.addDialog.openDialog();
    }
    const deleteInfo = (id) => {
      deleteIds.id[0] = id
      removeTips({
        value: "确认删除当前信息",
        fn: confirmInfo
      })
    }
    const confirmInfo = () => {
      DeleteInfo(deleteIds).then(response => {
        let resData = response.data.data
        // tableData.item.shift()
        tableData.total -= resData.data.length
        // tableData.item.forEach(item1,index => {
        //   resData.data.forEach( item2 => {
        //     if(item1.id == item2){
        //       tableData.item.splice(index,1)
        //     }
        //   })
        // })
        // 请求删除接口成功后 清空deleteIds
        deleteIds.id.splice(0,deleteIds.id.length)
        // console.log(resData);
        getList()
      }).catch(err => {
        console.log(err);
      })
    }
    const removeAllNews = () => {
      if(deleteIds.id.length == 0){
        root.$message({
          message: "未选中任何内容",
          type: "warning"
        })
        // 当用户选中再取消时 不能及时清空数组  导致无法弹出此提示
        // deleteIds.id.splice(0,deleteIds.id.length)
        return false
      }
      removeTips({
        value: "确认删除所选信息",
        fn: confirmInfo
      })
    }
    const editDetails = (editObj) => {
      root.$router.push({
        name: "Detailed",
        params: {
          id: editObj.id,
          title: editObj.title
        }
      })
      root.$store.commit("detailed/updateState",editObj)
    }
    const editNews = (editObj) => {
      refs.editDialog.openDialog();
      refs.editDialog.receiveEditObj(editObj);
    }
    // 给参数设置一个默认值 
    const getList = (searchObj = {
      pageNumber: pageObj.current,
      pageSize: pageObj.size
    }) => {
      tableData.loading = true
      GetList(searchObj).then(res => {
        let resData = res.data.data
        tableData.item = resData.data
        formatCate() // 返回的数据中未包括分类名，手动格式化
        tableData.total = res.data.data.total
        tableData.loading = false
      }).catch(err => {
        tableData.loading = false
        console.log(err);
      })
    }
    // 加载过快  有时会在options.item还未接收到数据时执行 导致分类为空（概率不大，但是会有一定影响）
    // 解决办法：在tableData.item和options.item获取到值之后 各调用一次(浪费内存)
    //const formatCate = row => options.item.filter(item => item.id == row.categoryId)[0].category_name
    const formatCate = () => {
      tableData.item.forEach(item1 => {
        options.item.forEach((item2) => {
          if(item1.categoryId == item2.id){
            item1.categoryName = item2.category_name
          }
        })
      })
    }
    const formatTime = row => formatDate(Number(row.createDate))
    const handleSelectionChange = (val) => {
      val.forEach((item,index) => {
        deleteIds.id[index] = item.id
      })
    }
    const search = () => {
      let reqData = {
        categoryId: searchOptions.typeValue,
        startTime: searchOptions.dateValue[0],
        endTime: searchOptions.dateValue[1],
        [searchOptions.keyValue]: searchOptions.inputValue, //我真是个天才 乱写一段代码 竟然也实现了效果
        pageNumber: pageObj.current,
        pageSize: pageObj.size
      }
      getList(reqData)
    }
    onMounted(() => {
      getInfoCategoryAll()
      getList()
    })
    watch(() => categoryInfo.item,(value) => {
      options.item = value
      formatCate()
    })
    return {
      options,keyOptions,tableData,searchOptions,
      handleSizeChange,handleCurrentChange,addNews,deleteInfo,editNews,configOptions,
      removeAllNews,getList,formatTime,formatCate,handleSelectionChange,search,editDetails
    };
  },
};
</script>

<style lang='scss' scoped>
#infoIndex{
  font-size: 14px;
  .el-row{
    margin: 0 !important;
  }
  .label-value{
    margin-right: 15px;
  }
  .el-table{
    margin-top: 15px;
    font-size: 14px;
  }
  .page-foot{
    margin-top: 15px !important;
    .batch{
      padding: 0 !important;
    }
    .paging{
      text-align: right;
      padding: 0 !important;
    }
    .el-pagination{
      padding: 2px 0;
    }
  }
}

</style>
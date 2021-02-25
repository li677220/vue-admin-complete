<template>
 <div id="userIndex">
   <el-row :gutter="16">
      <el-col :span="4">
        <label for="">
          <span class="label-value">关键字：</span>
          <!-- <el-select v-model="searchContent.selectValue" placeholder="请选择" style="width: 130px">
            <el-option
              v-for="item in options.item"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <SelectCmp :config="configOptions" ref="selectCmp"/>
        </label>
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchContent.keyWords" placeholder="请输入" style="width:130px"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="searchUser">搜索</el-button>
      </el-col>
      <el-col :span="15">
        <el-button type="primary" icon="el-icon-plus" class="full-right" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <TableCmp :config="configTable" ref="tableCmp">
      <template v-slot:status="slotData">
        <!--  active-value="2"(启用) inactive-value="1"(禁用)  -->
        <el-switch v-model="slotData.data.status" active-value="2" inactive-value="1" :disabled="disableSwitch"
        active-color="#13ce66" inactive-color="#ff4949" @change="disableUser(slotData.data)"></el-switch>
      </template>
      <template v-slot:handle="slotData">
        <el-button size="mini" type="danger" @click="removeItem(slotData.data)">删除</el-button>
        <el-button size="mini" type="success" @click="editItem(slotData.data)">操作</el-button>
      </template>
      <!-- <template v-slot:batchRemove="slotData">
        <el-button size="small" @click="removeItem(slotData.data)">批量删除</el-button>
      </template> -->
    </TableCmp>
    <AddUserCmp ref="addUserDialog" @getUserList="getUserList" :model="model"></AddUserCmp>
 </div>
</template>

<script>
import { reactive, ref } from '@vue/composition-api'
import SelectCmp from "@/components/Select/index.vue"
import TableCmp from "@/components/Table/index.vue"
import { DeleteUser, DisableUser, GetUserList } from "@/api/user.js" 
import AddUserCmp from "./dialog/add.vue"
import { global } from "@/utils/globalv3.js"
export default {
  name: "UserIndex",
  components: { SelectCmp, TableCmp, AddUserCmp },
  setup(props,{ root, refs }){
    const { removeTips } = global()
    const configOptions = reactive({
      // 下拉框需要的内容
      options:["phone","username"]
    })
    const configTable = reactive({
      selection: true, //是否需要表格前面的多选框,默认为true
      tHead: [{
        label: "邮箱/用户名",
        field: "username",
        // field: "title",
        width: "160"
      }, {
        label: "姓名",
        field: "truename",
        width: "120"
      }, {
        label: "手机号",
        field: "phone",
        width: "180"
      }, {
        label: "地址",
        field: "region",
        // width: "180"
      }, {
        label: "角色",
        field: "role",
        width: "180"
      }, {
        label: "禁启用状态",
        field: "status",
        width: "120",
        columnType: "slot",
        slotName: "status"
      }, {
        label: "操作",
        field: "handle",
        width: "180",
        columnType: "slot",
        slotName: "handle"
      }],
      // requestUrl: "/user/getList/",
      //是否需要显示页码,默认为true
      pagination: true,
      load: true
    })
    const searchContent = reactive({
      selectValue: "",
      keyWords: ""
    })
    const userForm = reactive({
      name: "",
      phone: "",
      address: "",
      email: ""
    })
    const disableSwitch = ref(false)
    let model = reactive({
      type: ""
    })
    const getUserList = () => {
      refs['tableCmp'].getList()
    }
    const removeItem = (params) => {
      removeTips({
        value: "确认删除当前信息",
        fn: function(){
          let reqData = { 
            id: [params.id]
          }
          // console.log(refs['tableCmp']);
          // return false
          DeleteUser(reqData).then(res => {
            // 删除成功，更新数据
            getUserList()
          }).catch(err => {
            console.log(err);
          })
        }
      }) 
    }
    const editItem = (params) => {
      model.type = "edit"
      refs.addUserDialog.receiveEditData(params)
      refs.addUserDialog.openDialog()
    }
    const addUser = () => {
      model.type = "add"
      refs.addUserDialog.openDialog()
    }
    const disableUser = (params) => {
      let reqData = {
        id: params.id,
        status: params.status
      }
      DisableUser(reqData).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
      disableSwitch.value = true
      setTimeout(() => {
        disableSwitch.value = false
      },5000)
    }
    const searchUser = () => {
      let {key} = refs['selectCmp'].getCurrentSelect()
      let reqData = {
        [key]: searchContent.keyWords,
        pageNumber: 1,
        pageSize: 10
      }
      refs['tableCmp'].loadingData(reqData)
    }
    return{
      userForm,configOptions,configTable,
      disableSwitch,model,
      searchContent,removeItem,editItem,addUser,getUserList,disableUser,searchUser
    }
  }
}
</script>

<style lang='scss' scoped>
#userIndex{
  font-size: 14px;
}
.el-row{
  margin: 0 0 15px !important;
}
 
</style>
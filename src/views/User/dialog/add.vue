<template>
  <div id="addUserDialog">
    <el-dialog
      :title="model.type == 'add' ? '新增' : '编辑'"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="dialogClose"
      :modal="false">
        <el-form label-position="right" label-width="80px" :model="addForm" ref="addForm">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="addForm.username" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password" v-if="model.type == 'add'">
            <el-input type="password" v-model="addForm.password" placeholder="请输入密码(6-20位数字+密码)"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="truename">
            <el-input v-model="addForm.truename" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.number="addForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="地区：" prop="region">
            <CitySelect ref="citySelect"></CitySelect>
          </el-form-item>
          <el-form-item label="禁/启用：">
            <el-radio v-model="addForm.status" label="1">禁用</el-radio>
            <el-radio v-model="addForm.status" label="2">启用</el-radio>
          </el-form-item>
          <el-form-item label="角色：" prop="role">
            <el-checkbox-group v-model="addForm.role" :max="1">
              <el-checkbox v-for="(item,i) in checkboxList.item" :label="item.role" :key="i">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import sha1 from "sha1"
import { reactive, ref } from '@vue/composition-api'
import CitySelect from "@/components/CitySelect/index.vue"
import { GetRole, AddUser, EditUser, GetSystem } from "@/api/user.js"
import { validateEmail, validatePassword, validatePhone } from "@/utils/validate.js"
export default {
components: { CitySelect },
props:{
  model:{
    type: Object,
    default: () => {}
  }
},
setup(props,context){
    const addForm = reactive({
    username: '',
    truename: '',
    password: '',
    phone: '',
    region: null,
    status: '2',
    role: [],
    btnPerm: ''
  })
  const checkboxList = reactive({
    item: []
  })
  let dialogVisible = ref(false)
  const getRole = () => {
    // 获取角色
    GetRole().then(res => {
      checkboxList.item = res.data.data
    }).catch(err => {
      console.log(err);
    })
    // 获取系统
    // GetSystem().then(res => {
    //   checkboxList.item = res.data.data
    //   console.log(checkboxList.item);
    // }).catch(err => {
    //   console.log(err);
    // })
  }
  const dialogClose = () => {
    dialogVisible.value = false
    resetAddform()
  }
  const openDialog = () => {
    dialogVisible.value = true
    getRole()
    // console.log(props.model.type);
  }
  // 提交表单前 将表单数据格式化为所需的格式
  const formatAddform = () => {
    addForm.region = JSON.stringify(context.refs['citySelect'].getAddress())
    let reqData = JSON.parse(JSON.stringify(addForm))
    reqData.role = reqData.role.toString()
    reqData.password = sha1(reqData.password)
    return reqData
    // addForm.password = sha1(addForm.password)
  }
  const resetAddform = () => {
    // 使用elementui自带清空表单会存在bug(先点编辑再点新增 表单数据无法清空)
    addForm.username = ""
    addForm.truename = ""
    addForm.password = ""
    addForm.phone = ""
    addForm.region = null
    addForm.status = "2"
    addForm.role = []
    // context.refs["addForm"].resetFields();
    context.refs["citySelect"].resetCurrentData()
  }
  const validateAddform = () => {
    let flag = validatePhone(addForm.phone) && validateEmail(addForm.username) && addForm.role.length != 0
    // 编辑用户不用验证密码
    if(props.model.type == "add"){
      flag = flag && validatePassword(addForm.password)
    }
    return flag
  }
  const confirmHandle = () => {
    // 验证表单数据
    if(!validateAddform()){
      context.root.$message({
        message: "填入信息有误，请核对",
        type: "error"
      })
      return false
    }
    if(props.model.type == "add"){
      addUser()
    }else if(props.model.type == "edit"){
      editUser()
    }
  }
  const addUser = () => {
    // dialogVisible.value = false
    
    //浅拷贝导致下一次多选框无法正常使用
    // Object.assign({}, addForm) 在没有二级属性时可以实现深拷贝
    // JSON.parse(JSON.stringify(addForm)) 当属性中含有函数、undefined、Symbol时,属性会丢失
    // let reqData = JSON.parse(JSON.stringify(addForm))
    // reqData.role = reqData.role.toString()
    // reqData.password = sha1(reqData.password)
    // 格式化表单信息 获取请求对象
    let reqData = formatAddform()
    AddUser(reqData).then(res => {
      dialogVisible.value = false
      // 用户添加成功 清空表单 刷新数据
      resetAddform()
      context.emit("getUserList")
    }).catch(err => {
      console.log(err);
    })
  }
  const editUser = () => {
    let reqData = formatAddform()
    console.log(reqData);
    EditUser(reqData).then(res => {
      console.log(reqData);
      dialogVisible.value = false
      // 用户修改成功 清空表单 刷新数据
      resetAddform()
      context.emit("getUserList")
    }).catch(err => {
      console.log(err);
    })
  }
  // 接收父组件传递过来的待编辑的对象
  const receiveEditData = (val) => {
    for(let item in val){
      addForm[item] = val[item]
    }
    // 角色显示为Array形式，传递为String形式
    addForm.role = addForm.role.split(',');
    // console.log(addForm.role);
  }
  return{
    addForm,checkboxList,
    dialogVisible,
    dialogClose,openDialog,receiveEditData,confirmHandle
  }
}
}
</script>

<style lang='scss' scoped>
.el-dialog__header{
  padding-bottom: 0 !important;
}

.el-form-item{
  margin: 15px 15px;
}
.el-row{
  margin: 0 !important;
}
// .el-row > .el-col:first-child{
//   padding-left: 0 !important;
// }
// .el-row > .el-col:last-child{
//   padding-right: 0 !important;
// }
</style>
<style lang="scss">
#addUserDialog{
  .el-dialog__body{
    padding: 0px 20px !important; 
  } 
}
</style>
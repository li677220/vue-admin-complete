<template>
 <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="37%"
    :before-close="dialogClose" @open="openDialog">
        <el-form label-width="80px" :model="addForm" ref="addForm">
          <el-form-item label="类型：" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择"
            @change="currentChange" style="width: 30%">
              <el-option
                v-for="item in category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题：" prop="title">
            <el-input v-model="addForm.title" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="概况：" prop="content">
            <el-input type="textarea" :rows="5" placeholder="请输入内容"
            resize="none" v-model="addForm.content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateData">确 定</el-button>
        </span>
    </el-dialog>
 </div>
</template>

<script>
import { AddInfo, EditInfo } from "@/api/news"
import { formatDate } from "@/utils/common.js"
import { common } from "@/api/common.js"
import { onMounted, reactive, ref, watch } from "@vue/composition-api"
export default {
  props: {
    category:{
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ""
    }
  },
  setup(props,context){
    // 数据由父元素传递过来  减少请求
    const { categoryInfo, getInfoCategory } = common();
    const addForm = reactive({
      type: '',
      title: '',
      content: ''
    })
    let currentItem = reactive({})
    let dialogVisible = ref(false)
    let editObj =reactive({})
    const dialogClose = () => {
      dialogVisible.value = false
    }
    const openDialog = () => {
      dialogVisible.value = true
    }
    // val: 选中的id
    const currentChange = (val) => {
      props.category.forEach(item => {
        if(item.id == val){
          currentItem = item
          console.log(item);
        }
      })
    }
    const updateData = () => {
      props.title == "新增" ? addInfo() : editInfo()
    }
    const addInfo = () => {
      let reqData = {
        categoryId: currentItem.id,
        title: addForm.title,
        // imgUrl: "",
        createDate: formatDate(),
        // createDate: "2020-02-02 12:00:00",
        content: addForm.content
      }
      AddInfo(reqData).then(res => {
        addForm.type = '',
        addForm.title = '',
        addForm.content = ''
        // context.refs[addForm].resetFields();
        dialogVisible.value = false
        context.emit('getList')
        // console.log(context.root.$parent);
      }).catch(err => {
        console.log(err);
      })
    }
    const editInfo = () => {
      let reqData = {
        id: editObj.id,
        categoryId: currentItem.id,
        title: addForm.title,
        updateDate: formatDate(),
        content: addForm.content,
        // imgUrl: ""
      }
      console.log(currentItem);
      // return false
      EditInfo(reqData).then(res => {
        addForm.type = '',
        addForm.title = '',
        addForm.content = ''
        dialogVisible.value = false
        context.emit('getList')
      }).catch(err => {
        console.log(err);
      })
    }
    // 接收父元素传递过来的需要修改的对象
    const receiveEditObj = (edObj) => {
      editObj = edObj
      console.log(edObj);
      addForm.type = editObj.categoryName,
      addForm.title = editObj.title,
      addForm.content = editObj.content
      currentItem.id = editObj.categoryId,
      currentItem.category_name = editObj.categoryName
    }
    return{
      dialogVisible,
      addForm,currentItem,
      dialogClose,openDialog,currentChange,updateData,receiveEditObj
    }
  }
}
</script>

<style lang='scss'>
.v-modal{
  visibility: hidden;
}
</style>

<template>
  <div id="category">
    <div class="first_btn_wrap">
    <el-button type="danger" @click="add({type: 'category_first_add'})">添加一级分类</el-button>
    </div>
    <el-row :gutter="30">
      <el-col :span="10">
        <div class="cate-left">
          <div class="category-item" v-for="(item,i) in category.item" :key="i">
            <!-- 一级分类 -->
            <h4>
              <svg-icon iconClass="plus" className="plus"></svg-icon>
              <span>{{item.category_name}}{{item.id}}</span>
              <div class="btn-group">
                <el-button size="mini" type="danger" round @click="editCategory({data: item, type: 'category_first_edit'})">编辑</el-button>
                <el-button size="mini" type="success" round @click="addSecondCate({data: item, type: 'category_second_add'})">添加子级</el-button>
                <el-button size="mini" type="" round @click="deleteCategory(item.id)">删除</el-button>
              </div>
            </h4>
            <!-- 二级分类 -->
            <ul v-if="item.children">
              <li v-for="(subitem,j) in item.children" :key="j">
                <span>{{subitem.category_name}}</span>
                <div class="btn-group">
                  <el-button size="mini" type="danger" round>编辑</el-button>
                  <el-button size="mini" type="" round>删除</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="cate-right">
          <div class="cate-right-content">
            <h4>一级分类编辑</h4>
            <el-form label-width="80px" :model="cateForm" :ref="cateForm">
              <el-form-item label="一级分类名称：" v-show="inputStatus.first">
                <el-input v-model="cateForm.first" :disabled="inputStatus.firstInputDis"
                placeholder="点击左上按钮添加一级分类" @focus="hasFocus"></el-input>
              </el-form-item>
              <el-form-item label="二级分类名称：" v-show="inputStatus.second">
                <el-input v-model="cateForm.second" :disabled="inputStatus.secondInputDis"
                @focus="hasFocus"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="success" size="medium" @click="addFirstCategory"
            :loading="confirmBtnStatus.loading" :disabled="confirmBtnStatus.disable">确定</el-button>
            <el-button type="danger" size="medium">取消</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { AddFirstCategory, DeleteCategory, EditCategory, AddChildrenCategory } from "@/api/news";
import { reactive, onMounted, watch } from "@vue/composition-api";
import { common } from "@/api/common.js"
import { global } from "@/utils/globalv3.js"
import SvgIcon from "../../icons/svg-icon.vue";
export default {
  name: "Category",
  setup(props, { refs, root }) {
    const { categoryInfo, getCategory, getInfoCategoryAll } = common()
    const { removeTips } = global();
    const cateForm = reactive({
      first: "",
      firstId: "",
      second: "",
    });
    const inputStatus = reactive({
      first: true,
      firstInputDis: true,
      second: true,
      secondInputDis: true,
    });
    const confirmBtnStatus = reactive({
      loading: false,
      disable: true,
      type: ""
    })
    let category = reactive({
      item: [],
      current: {}
    });
    // const changeInputStatus = (params) => {
    //   console.log(params);
    //   inputStatus.first = params.first || inputStatus.first,
    //   inputStatus.firstInputDis = params.firstInputDis || inputStatus.firstInputDis,
    //   inputStatus.second = params.second || inputStatus.second,
    //   inputStatus.secondInputDis = params.secondInputDis || inputStatus.secondInputDis,
    //   confirmBtnStatus.loading = params.confirmBtnLoading || confirmBtnStatus.loading,
    //   confirmBtnStatus.disable = params.confirmBtnDisable || confirmBtnStatus.disable
    // }
    const addFirstCategory = () => {
      if (cateForm.first == "") {
        root.$message({
          message: "内容不能为空",
          type: "error",
        });
        return false;
      }
      // 添加分类
      if(confirmBtnStatus.type == "category_first_add"){
        confirmTypeAdd()
      }else if(confirmBtnStatus.type == "category_first_edit"){
      //修改分类
        confirmTypeEdit()
      }else if(confirmBtnStatus.type == "category_second_add"){
        confirmSecondAdd()
      }
      
    };
    const confirmTypeAdd = () => {
      // confirmBtnStatus.loading = true
        let requestData = {
          categoryName: cateForm.first,
        };
        AddFirstCategory(requestData).then((response) => {
        // 添加成功之后  更新左侧分类
        // 1、直接更新 category.item
        category.item.push(response.data.data)
        // 2、请求接口获取最新分类 内存资源消耗更大
        // getCategory()
      }).catch(err => {});
      // changeInputStatus({confirmBtnLoading: false})
      confirmBtnStatus.loading = false
      // refs["cateForm"].resetFields()  //bug  表单清空出错
      cateForm.first = ""
    }
    const confirmTypeEdit = () => {
      // 名称应该为输入框里的名称（category.current.category_name是修改之前的名称）
      let requestData = {
        id: category.current.id,
        categoryName: cateForm.first
      }
      // 修改服务器存储的数据
      EditCategory(requestData).then(response => {
        // 服务器上的数据修改成功之后 再修改本地数据
        category.item.forEach(item => {
          if(item.id == requestData.id){
            item.category_name = response.data.data.data.categoryName
          }
          // console.log(category);
        })
        cateForm.first = ""
        category.current = {}
      }).catch(err => {console.log(err);})

    }
    const confirmSecondAdd = () => {
      if(!cateForm.second){
        root.$message({
          message: "分类名称不能为空",
          type: "error"
        })
        return false
      }
      let reqData = {
        categoryName: cateForm.second,
        parentId: cateForm.firstId
      }
      AddChildrenCategory(reqData).then(res => {
        // res.data.data
        console.log(category.item);
        console.log(category.current);
      }).catch(err => {
        console.log(err);
      })
    }
    // const getCategory = () => {
    //   GetCategory().then(response => {
    //     let resData = response.data.data.data
    //     category.item = resData
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // }
    const add = (params) => {
      // changeInputStatus({
      //   firstInputDis: false,
      //   second: false,
      //   confirmBtnDisable: false
      // })
      cateForm.first = ""
      inputStatus.second = false;
      inputStatus.firstInputDis = false
      confirmBtnStatus.disable = false
      confirmBtnStatus.type = params.type
    };
    const deleteCategory = (id)=> {
      removeTips({
        value: "即将删除当前分类",
        // 此方法如果抽离出去 则参数传递逻辑出现问题 有待改进
        fn: function (){
          let requestData = { categoryId:id }
          DeleteCategory(requestData).then(response => {
            // 删除成功之后 更新列表
            // 1、getCategory()  //减少资源浪费
            // 2、手写一个方法 更新category.item
            afterDelete(requestData.categoryId)
          }).catch(err => {
            requestData = null
            console.log(err);
          })
        }
      })
    }
    const afterDelete = (id) => {
      category.item = category.item.filter(item => item.id !== id)
    }
    const editCategory = (params) => {
      cateForm.first = params.data.category_name
      inputStatus.firstInputDis = false
      inputStatus.second = false
      confirmBtnStatus.disable = false
      confirmBtnStatus.type = "category_first_edit"
      // console.log(item);
      confirmBtnStatus.type = params.type
      category.current = params.data
      // 修改category数据
    }
    const addSecondCate = (item) => {
      confirmBtnStatus.type = item.type
      cateForm.first = item.data.category_name
      inputStatus.firstInputDis = true
      inputStatus.second = true
      inputStatus.secondInputDis = false
      cateForm.firstId = item.data.id
      console.log(item);
    }
    const hasFocus = () => {
      confirmBtnStatus.disable = false
    }
    onMounted(() => {
      getInfoCategoryAll()
      console.log(categoryInfo);
    })
    watch(() => categoryInfo.item,(value) => {
      category.item = value
    })
    return {
      cateForm, inputStatus, category, confirmBtnStatus,
      addFirstCategory, add, deleteCategory,editCategory,addSecondCate,hasFocus
    };
  },
  
};
</script>

<style lang='scss' scoped>
.first_btn_wrap {
  // margin: 0 -15px;
  height: 60px;
  border-bottom: 1px solid rgba(204, 204, 204, 0.5);
}
.el-row {
  margin: 15px 0 !important;
  // & div:first-child{
  //   // padding-left: 0 !important;
  // }
  & div:last-child {
    padding-right: 0 !important;
  }
  li {
    list-style: none;
    font-size: 14px;
    line-height: 30px;
  }
}
.cate-left {
  // height: 300px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  // background-color: royalblue;
  h4 {
    margin: 0;
    line-height: 30px;
    position: relative;
  }
}
ul {
  position: relative;
  margin-top: 5px;
  &::before {
    content: "";
    width: 1px;
    height: 100%;
    position: absolute;
    border-left: 1px black dashed;
    top: -16px;
    left: 9px;
  }
  li {
    position: relative;
    &::before {
      content: "";
      width: 25px;
      border-bottom: 1px black dashed;
      position: absolute;
      top: 13px;
      left: -30px;
    }
  }
}
// h4:hover,
// li:hover{
//   transition: all .5s ease 0s;
//   background-color: rgba(204, 204, 204, .5);
// }

.cate-right {
  // height: 300px;
  // background-color: salmon;
  .cate-right-content{
    width: 50%;
    text-align: center;
    h4 {
      text-align: left;
      line-height: 35px;
    }
    button {
      margin: 0 20px;
    }
  }
}
.plus {
  margin: 0 5px -2px 1px;
  // margin-bottom: -3px;
  line-height: 20px;
  font-size: 16px;
}
li,
h4 {
  transition: all 0.5s ease 0s;
  &:hover {
    background-color: rgba(204, 204, 204, 0.5);
    .btn-group {
      display: inline-block;
    }
  }
}
.btn-group {
  display: none;
  font-size: 12px;
  position: absolute;
  right: 5px;
  top: 0;
  transition: all 0.5s ease 0s;
  & button {
    padding: 5px 12px !important;
  }
}
</style>
<style lang="scss">
.cate-right {
  .el-form-item {
    line-height: 50px;
  }
  .el-form-item__label {
    width: 150px !important;
  }
  .el-input__inner {
    width: 200px !important;
  }
  .el-form-item__content {
    display: inline-block;
    margin-left: 0 !important;
  }
}
</style>
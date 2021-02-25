<template>
  <div id="detailed">
    <el-form ref="form" :model="detailedForm" label-width="100px">
      <el-form-item label="信息分类：">
        <el-select v-model="detailedForm.id" placeholder="请选择" style="width: 220px">
          <el-option
            v-for="item in category.item"
            :key="item.id"
            :label="item.category_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻标题：">
        <el-input v-model="detailedForm.title" placeholder="请输入标题" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item label="缩略图：">
        <!-- <el-upload
          class="avatar-uploader"
          action="http://up-z2.qiniup.com"
          :show-file-list="false"
          :data="uploadKey"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="detailedForm.imgUrl" :src="detailedForm.imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <uploadImg :imgUrl="detailedForm.imgUrl" ref="uploadImg"></uploadImg>
      </el-form-item>
      <el-form-item label="发布日期：">
        <el-date-picker
          v-model="detailedForm.date"
          type="date"
          placeholder="选择日期"
          disabled>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="详细内容：">
        <quillEditor v-model="detailedForm.detailedContent" ref="myQuillEditor" :options="editorOption">
        </quillEditor>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<script>
import { onMounted, reactive, watch, ref } from '@vue/composition-api'
import { common, GetQiniuToken } from "@/api/common.js"
import { formatDate } from "@/utils/common.js"
import { GetList, EditInfo} from "@/api/news";
import uploadImg from "@/components/UploadImg/index.vue"
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  name: "Detailed",
  components: { quillEditor, uploadImg },
  setup(props,context){
    const { categoryInfo, getInfoCategoryAll } = common();
    let id = context.root.$route.params.id || sessionStorage.getItem("infoId")
    // let title = context.root.$route.params.title || sessionStorage.getItem("infoTitle")
    const detailedForm = reactive({
      id: "",
      type: "",
      title: "",
      imgUrl: "",
      date: "",
      detailedContent: ""
    })
    let currentItem = reactive({})
    const categoryOptions = reactive([])
    const editorOption = reactive({})
    const category = reactive({
      item: []
    })
    // const uploadKey = reactive({
    //   token: "",
    //   key: ""
    // })
    const getCurrentItem = () => {
      let reqData = {
        id,
        pageNumber: 1,
        pageSize: 1
      }
      GetList(reqData).then(res => {
        currentItem = res.data.data.data[0]
        // console.log(currentItem);
        detailedForm.id = currentItem.categoryId  
        detailedForm.title = currentItem.title
        detailedForm.date = formatDate(currentItem.date)
        detailedForm.detailedContent = currentItem.content
        detailedForm.imgUrl = currentItem.imgUrl
      }).catch(err => {
        console.log(err);
      })
    }
    const save = () => {
      // return false
      let reqData = {
        id,
        categoryId: detailedForm.id,
        title: detailedForm.title,
        updateDate: formatDate(),
        content: detailedForm.detailedContent,
        // imgUrl: detailedForm.imgUrl
        imgUrl: context.refs['uploadImg'].getImgUrl()
      }
      // return false
      EditInfo(reqData).then(res => {
        context.root.$router.push({
          path: "/infoIndex",
        })
      // 刷新列表
      }).catch(err => {
        console.log(err);
      })
    }
    // 上传成功的回调
    // const handleAvatarSuccess = (res, file) => {
    //   //res:{hash: "****",key: "文件名"}
    //   detailedForm.imgUrl = `http://qnsxauw8z.hn-bkt.clouddn.com/${res.key}`
    //   // imgUrl = URL.createObjectURL(file.raw);
    // }
    // const beforeAvatarUpload = file => {
    //   const isJPG = file.type === 'image/jpeg';
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isJPG) {
    //     context.root.$message.error('上传头像图片只能是 JPG 格式!');
    //   }
    //   if (!isLt2M) {
    //     context.root.$message.error('上传头像图片大小不能超过 2MB!');
    //   }
    //   // 文件名转码
    //   let suffix = file.name
    //   let key = encodeURI(`${suffix}`)
    //   uploadKey.key = key
    //   return isJPG && isLt2M;
    // }
    // const getQiniuToken = () => {
    //   let reqData = {
    //     ak: "_5Ao553z_pubwke37Fup9XhWj4Oa3i8SXPHdSCgU",
    //     sk: "D7nkQQI5iQHxD76kZCBBGGrSnPinWAkdCGiA0isc",
    //     buckety: "li677220"
    //   }
    //   GetQiniuToken(reqData).then(res => {
    //     uploadKey.token = res.data.data.token
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // }
    onMounted(() => {
      getInfoCategoryAll()
      getCurrentItem()
      // getQiniuToken()
    })
    watch(() => categoryInfo.item,(value) => {
      category.item = value
    })
    return{
      detailedForm,categoryOptions,category,editorOption,
      save,
      // handleAvatarSuccess,beforeAvatarUpload,uploadKey,
    }
  },
}
</script>

<style lang='scss' scoped>
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 30px;
  color: #8c939d;
  width: 220px;
  height: 220px;
  line-height: 220px;
  text-align: center;
}
.avatar {
  width: 220px;
  height: 220px;
  display: block;
}
 
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
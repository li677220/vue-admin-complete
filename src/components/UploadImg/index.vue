<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="http://up-z2.qiniup.com"
      :show-file-list="false"
      :data="uploadKey"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="completeImg.url" :src="completeImg.url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { GetQiniuToken } from "@/api/common.js"
import { reactive, watch, ref, onMounted } from '@vue/composition-api'
/**
 * 封装组件的核心问题
 * 1、组件需要实现什么事情（实现的过程中需要哪些参数） eg：获取七牛云token、显示默认图片、选择后渲染在当前组件内
 * 2、实现的结果是什么（实现之后需要返回什么东西） eg: 返回当前图片的路径
 */
export default {
name: "UploadImg",
props: {
  imgUrl: {
    type: String,
    default: ""
  },
  // completeImgUrl: {
  //   type: String,
  //   default: ""
  // }
},
setup(props, context){
  const uploadKey = reactive({
    token: "",
    key: ""
  })
  // 上面需要即时更新 使用ref则会导致拿到数据后无法更新
  let completeImg = reactive({
    url: ""
  })
  // const imgUrl = ref("")
  // 上传成功的回调
  const handleAvatarSuccess = (res, file) => {
    //res:{hash: "****",key: "文件名"}
    completeImg.url = `http://qnsxauw8z.hn-bkt.clouddn.com/${res.key}`
    // imgUrl = URL.createObjectURL(file.raw);
  }
  const beforeAvatarUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG) {
      context.root.$message.error('上传头像图片只能是 JPG 格式!');
    }
    if (!isLt2M) {
      context.root.$message.error('上传头像图片大小不能超过 2MB!');
    }
    // 文件名转码
    let suffix = file.name
    let key = encodeURI(`${suffix}`)
    uploadKey.key = key
    return isJPG && isLt2M;
  }
  const getImgUrl = () => {
    return completeImg.url
  }
  const getQiniuToken = () => {
    let reqData = {
      ak: "_5Ao553z_pubwke37Fup9XhWj4Oa3i8SXPHdSCgU",
      sk: "D7nkQQI5iQHxD76kZCBBGGrSnPinWAkdCGiA0isc",
      buckety: "li677220"
    }
    GetQiniuToken(reqData).then(res => {
      uploadKey.token = res.data.data.token
    }).catch(err => {
      console.log(err);
    })
  }
  watch(() => props.imgUrl, value => {
    completeImg.url = value
  })
  onMounted(() => {
    getQiniuToken()
  })
  return{
    uploadKey,
    completeImg,
    handleAvatarSuccess,beforeAvatarUpload,getQiniuToken,getImgUrl
  }
}
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
</style>>

import { Message } from "element-ui";
import { getToken, getUserName } from "@/utils/app"

// const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';
const service = axios.create({
  baseURL: "/devApi",
  timeOut: 5000
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers["toKey"] = getToken("admin-token")
  config.headers["username"] = getUserName("username")
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // return Promise.resolve(response);
  let data = response.data
  // resCode 非0时，验证码错误
  if(data.resCode !== 0){
    Message.error({
      message: data.message
    })
    return Promise.reject(data)
  }else{
    Message.success({
      message: data.message
    })
    return Promise.resolve(response)
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});


export default service
<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="(item, i) in menuTab"
          :key="i"
          @click="switchStatus(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="LoginForm"
        size="midium"
        class="login-form"
      >
        <el-form-item prop="username">
        <label for="username">用户名</label>
          <el-input v-model="ruleForm.username" type="text" id="userrname" placeholder="邮箱/手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label for="password">密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            maxlength="20"
            minlength="6"
            id="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword" v-if="model === 'register'">
          <label for="repassword">确认密码</label>
          <el-input
            type="password"
            v-model="ruleForm.repassword"
            autocomplete="off"
            id="repassword"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <label for="code">验证码</label><br>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                v-model="ruleForm.code"
                autocomplete="off"
                id="code"
                class="code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
                <el-button type="success" @click="getSms" :disabled="sms.status" :loading="sms.loading" class="block">{{ sms.content }}</el-button>
            </el-col>
          </el-row>
          
        </el-form-item>
        <el-form-item>
          <el-button 
          type="primary" class="login-btn" @click="submitForm(model)" :disabled="loginBtn.status" :loading="loginBtn.loading">{{model === "login" ? "登录" : "注册并登录"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "sha1"
import { GetSms, Login, Register } from "@/api/login"
import { onUnmounted, reactive, ref, toRefs } from "@vue/composition-api"
import { stripscript, validateEmail, validatePassword, validateCode } from "@/utils/validate"
export default {
  name: "Login",
  setup(props, {refs, root}) {

    let checkUsername = (rule, value, callback) => {
      sms.status = false
      if(validateEmail(value)){
        callback()
      }else{
        callback(new Error("用户名格式有误，请重新填写"));
      }
    };
    let checkPwd = (rule, value, callback) => {
      if(validatePassword(value)){
        callback()
      }else{
        callback(new Error("密码格式有误，请重新填写"))
      }
    };
    let checkRePwd = (rule, value, callback) => {
      sms.status = false
      if(value === ruleForm.password){
        callback()
      }else{
        root.$message({
          message: "两次密码不一致，请重新填写",
          type: "error"
        })
        callback(new Error("两次密码不一致，请重新填写"))
        return false
      }
      return (value === ruleForm.password)
    };
    let checkCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value)
      value = ruleForm.code
      if(validateCode(value)){
        loginBtn.status = false
        callback()
      }else{
        callback(new Error("验证码格式有误，请重新填写"))
      }   
    };

    const menuTab = reactive([
      { name: "登录", current: true, type: "login" },
      { name: "注册", current: false,type: "register" },
    ]);
    const ruleForm = reactive({
      username: "li888@163.com",
      password: "LJ18582266536",
      repassword: "",
      code: "",
    });
    const rules = reactive({
      username: [{ validator: checkUsername, trigger: "blur" }],
      password: [{ validator: checkPwd, trigger: "blur" }],
      repassword: [{ validator: checkRePwd, trigger: "blur" }],
      code: [{ validator: checkCode, trigger: "blur" }],
    });
    const sms = reactive({
      content: "获取验证码",
      status: false,
      loading: false,
      code: ""
    })
    let timer = reactive({}) 
    const model = ref("login");
    const loginBtn = reactive({
      status: true,
      loading: false
    })
    // const loginBtnStatus = ref(true)
    //声明函数
    // 切换登陆注册
    const switchStatus = (data) => {
      menuTab.forEach((item) => {
        item.current = false;
      });
      data.current = true;
      model.value = data.type
      refs["LoginForm"].resetFields()
    };
    // 登录、注册提交表单
    const submitForm = (model) => {
      let data = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
      }
      loginBtn.loading = true
      if(model == "login"){
        // Login(data).then((response) => {
        //   loginBtn.loading = false
        //   root.$router.push({    //参数不可见  
        //     name: "Console"
        //   })
        // })
        root.$store.dispatch("login/login",data).then((res) => {
          loginBtn.loading = false
          root.$router.push({
            name: "Console"
          })
        })



          // root.$router.push({  //参数可见，刷新后不会消失
          //   path: "/console",
          //   query:{
          //     id: 123,
          //     pwd: 4456
          //   }
          // })
          // root.$router.push({    //参数可见   刷新后不会消失
          //   name: "Console",
          //   query:{
          //     id: 123,
          //     pwd: 4456
          //   }
          // })
          // root.$router.push({    //参数不可见  参数会被忽略
          //   path: "/console",
          //   params :{
          //     id: 123,
          //     pwd: 4456
          //   }
          // })
      }else if(model == "register"){
        Register(data).then(response => {
          loginBtn.loading = false
          console.log(response);
        }).catch(error => {
          loginBtn.loading = false
          console.log(error);
        })
      }
    };
    // 获取验证码
    const getSms = () => {
      if(ruleForm.username == "" || !validateEmail(ruleForm.username)){
        root.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: '<b>邮箱</b> 格式错误',
          type: 'error'
        });
        return false
      }
      sms.content = "发送中"
      sms.status = true
      sms.loading = true
      let data = {
        username: ruleForm.username,
        module: model.value
      }
      GetSms(data).then(response => {
        sms.loading = false
        sms.content = "发送成功"
        loginBtn.status = false
        // 调用倒计时
        countDown(60)
        // 点击复制验证码   未实现
        // root.$message({
        //   dangerouslyUseHTMLString: true,
        //   message: response.data.message+ `        <el-button 
        //     class="el-icon-copy-document" 
        //     style="cursor: pointer;color: #000"
        //     v-on:click="console.log(123)"
        //     ></el-button>`,
        //   type: "success"
        // })
      }).catch(error => {
        sms.loading = false
        sms.content = "发送验证码"
        sms.status = false
        loginBtn.status = false
        console.log(error);
      })

    };
    // 获取验证码成功后，开启倒计时
    const countDown = (number) => {
      let time = number
      timer = setInterval(() => {
        if(time > 0 ){
          sms.content = `${time--}秒后可用`
        }else{
          clearInterval(timer)
          sms.content = "获取验证码"
          sms.status = false
        }
      },1000)
    };
    const copySms = () => {
      console.log(123);
    };
    onUnmounted(() => {
      clearInterval(timer)
    })
    return{
      menuTab,ruleForm,rules,sms,
      model,loginBtn,
      switchStatus,submitForm,getSms,copySms
    }
  },
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  width: 100vw;
  background-color: $mainColor;
  .login-wrap {
    width: 330px;
    margin: 0 auto;
    .menu-tab {
      width: 100%;
      display: flex;
      justify-content: center;
      list-style: none;
      margin: 0 auto;
      padding: 0;
      font-size: 14px;
      margin-bottom: 30px;
      // color: #fff;
      li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
      }
      .current {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
      }
    }
  }
}
.login-form{
  // .yzm{
  //   width: 60%;
  // }
  // .getYzm{
  // float: right;
  // }
  .login-btn{
    margin-top: 15px;
    width: 100%;
  }
}
.block{
  width: 100%;
}
</style>

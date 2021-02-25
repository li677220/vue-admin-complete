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
        ref="ruleForm"
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
          <el-row :gutter="16">
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
              <el-button type="success" class="getYzm">获取验证码</el-button>
            </el-col>
          </el-row>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/composition-api"
import { stripscript, validateEmail, validatePassword, validateCode } from "@/utils/validate"
export default {
  name: "Login",
  setup(props, {refs}) {

    let checkUsername = (rule, value, callback) => {
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
      if(value === ruleForm.password){
        callback()
      }else{
        callback(new Error("两次密码不一致，请重新填写"))
      }
    };
    let checkCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value)
      value = ruleForm.code
      if(validateCode(value)){
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
      username: "",
      password: "",
      repassword: "",
      code: "",
    });
    const rules = reactive({
      username: [{ validator: checkUsername, trigger: "blur" }],
      password: [{ validator: checkPwd, trigger: "blur" }],
      repassword: [{ validator: checkRePwd, trigger: "blur" }],
      code: [{ validator: checkCode, trigger: "blur" }],
    });
    const model = ref("login");

    //声明函数
    const switchStatus = (data) => {
      menuTab.forEach((item) => {
        item.current = false;
      });
      data.current = true;
      model.value = data.type
    };
    const submitForm = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    return{
      menuTab,ruleForm,rules,
      model,
      switchStatus,submitForm,checkUsername,checkPwd,checkRePwd,checkCode
    }
  },
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  width: 100vw;
  background-color: #bfa;
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

</style>

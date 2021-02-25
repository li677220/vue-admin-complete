<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <!-- <li :class='{current: isActive}' @click="switchStatus(0)">登录</li>
        <li :class='{current: !isActive}' @click="switchStatus">注册</li><br> -->
        <li
          :class="{ current: item.current }"
          v-for="(item, i) in menuTab"
          :key="i"
          @click="switchStatus(item)"
        >
          {{ item.name }}{{ item.id }}
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
          <el-button type="primary" class="login-btn" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { stripscript, validateEmail, validatePassword, validateCode } from "@/utils/validate"
export default {
  name: "Login",
  data() {
    //验证用户名
    var checkUsername = (rule, value, callback) => {
      // this.ruleForm.username = stripscript(value)
      // value = this.ruleForm.username // 邮箱不能过滤，某些邮箱中有字符
      if(validateEmail(value)){
        callback()
      }else{
        callback(new Error("用户名格式有误，请重新填写"));
      }
      // if (value === "") {
      //   callback(new Error("请输入用户名"));
      // } else if(!reg.test(value)) {
      //   callback(new Error("请输入正确格式用户名"));
      // }else{
      //   callback();
      // }
    };
    //验证密码
    var checkPwd = (rule, value, callback) => {
      // this.ruleForm.password = stripscript(value)
      // value = this.ruleForm.password //密码尽量不过滤否则导致用户自己都会不知道密码
      // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      // if (value === "") {
      //   callback(new Error("请输入密码"));
      // }else if(!reg.test(value)){
      //   callback(new Error("密码为6-20位"));
      // }else {
      //   callback();
      // }
      if(validatePassword(value)){
        callback()
      }else{
        callback(new Error("密码格式有误，请重新填写"))
      }
    };
    var checkRePwd = (rule, value, callback) => {
      if(value === this.ruleForm.password){
        callback()
      }else{
        callback(new Error("两次密码不一致，请重新填写"))
      }
    };
    var checkCode = (rule, value, callback) => {
      this.ruleForm.code = stripscript(value)
      value = this.ruleForm.code
      if(validateCode(value)){
        callback()
      }else{
        callback(new Error("验证码格式有误，请重新填写"))
      }
      
    };
    return {
      menuTab: [
        { name: "登录", current: true, type: "login" },
        { name: "注册", current: false,type: "register" },
      ],
      //表单数据
      ruleForm: {
        username: "",
        password: "",
        repassword: "",
        code: "",
      },
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        password: [{ validator: checkPwd, trigger: "blur" }],
        repassword: [{ validator: checkRePwd, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }],
      },
      model : "login"
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    switchStatus(data) {
      this.menuTab.forEach((item) => {
        item.current = false;
      });
      data.current = true;
      // if(data.type === "register"){
      //   this.model = "register"
      // }else{
      //   this.model = "login"
      // }  //我是笨比
      this.model = data.type
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
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

<template>
  <div id="login">
    <div class="loginBgContainer">
      <el-carousel indicator-position="none" height="100%" arrow="never" :interval="5000">
        <el-carousel-item v-for="item in 3" :key="item">
          <div class="loginBg" :data-img="item"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="loginContainer">
      <h1>可以找张图片[等之后找]</h1>
      <el-form class="loginForm" :model="loginForm" :rules="loginFormRules" ref="loginForm">
        <el-form-item prop="uname">
          <el-input placeholder="管理员名" v-model="loginForm.uname" auto-complete="off" @keyup.native.enter="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input placeholder="密码" type="password" v-model="loginForm.pass" auto-complete="off" @keyup.native.enter="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    let validateUname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理员名'));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        uname: '',
        pass: ''
      },
      loginFormRules: {
        uname: [
          { validator: validateUname, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        const loginForm = this.loginForm;
        if (valid) {
          const adminer = {
            uname: loginForm.uname,
            password: loginForm.pass
          };
          const res = await this.$http.post('/v2/admin/login', adminer);
          const ret = res.body;
          if (ret.code === 0) {
            window.sessionStorage.setItem('adminer', adminer.uname);
            return this.$router.push('/admin');
          } else {
            alert('async:', ret.msg);
          }
        } else {
          if (loginForm.uname === '') {
            return alert('管理员名不能为空');
          } else if (loginForm.pass === '') {
            return alert('密码不能为空！');
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
#login {
  $loginFormBg: #2b2b36;
  $fontPTSans: 'PT Sans', Helvetica, Arial, sans-serif;
  $transition: all .2s;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /*
  background: url('../assets/login/bg_1.jpg') no-repeat 50% 50%;
  background-size: cover;*/
  .loginBgContainer {
    width: 100%;
    height: 100%;
    .el-carousel {
      height: 100%;
    }
    .loginBg {
      height: 100%;
      background: url('../../assets/images/login/bg_1.jpg') no-repeat 50% 50%;
      background-size: cover;
      &[data-img="2"] {
        background-image: url('../../assets/images/login/bg_2.jpg');
      }
      &[data-img="3"] {
        background-image: url('../../assets/images/login/bg_3.jpg');
      }
    }
  }
  .loginContainer {
    position: absolute;
    top: 200px;
    width: 100%;
    z-index: 99;
    h1 {
      text-align: center;
    }
    .loginForm {
      width: 305px;
      margin: 15px auto 0 auto;
      text-align: center;
    }
    /*input style*/
    .el-input__inner {
      $inputBshadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset;
      $inputFocusBshadow: 0 2px 3px 0 rgba(0, 0, 0, .1) inset,
      0 2px 7px 0 rgba(0, 0, 0, .2);
      $inputTshadow: 0 1px 2px rgba(0, 0, 0, .1);
      $inputPlaceholderColor: #fff;
      box-sizing: content-box;
      width: 270px;
      height: 42px;
      margin-top: 25px;
      padding: 0 15px;
      background: #2d2d2d;
      /* browsers that don't support rgba */
      background: rgba(45, 45, 45, .15);
      -moz-border-radius: 6px;
      -webkit-border-radius: 6px;
      border-radius: 6px;
      border: 1px solid #3d3d3d;
      /* browsers that don't support rgba */
      border: 1px solid rgba(255, 255, 255, .15);
      -moz-box-shadow: $inputBshadow;
      -webkit-box-shadow: $inputBshadow;
      box-shadow: $inputBshadow;
      font-family: $fontPTSans;
      font-size: 14px;
      color: #fff;
      text-shadow: $inputTshadow;
      -o-transition: $transition;
      -moz-transition: $transition;
      -webkit-transition: $transition;
      -ms-transition: $transition;
      &:-moz-placeholder {
        color: $inputPlaceholderColor;
      }
      &:-ms-input-placeholder {
        color: $inputPlaceholderColor;
      }
      &::-webkit-input-placeholder {
        color: $inputPlaceholderColor;
      }
      &:focus {
        outline: none;
        -moz-box-shadow: $inputFocusBshadow;
        -webkit-box-shadow: $inputFocusBshadow;
        box-shadow: $inputFocusBshadow;
      }
    }
    /*submit style*/
    button {
      $buttonBshadow: 0 15px 30px 0 rgba(255, 255, 255, .25) inset,
      0 2px 7px 0 rgba(0, 0, 0, .2);
      $buttonHoverBshadow: 0 15px 30px 0 rgba(255, 255, 255, .15) inset,
      0 2px 7px 0 rgba(0, 0, 0, .2);
      $buttonActiveBshadow: 0 5px 8px 0 rgba(0, 0, 0, .1) inset,
      0 1px 4px 0 rgba(0, 0, 0, .1);
      cursor: pointer;
      width: 300px;
      height: 44px;
      margin-top: 25px;
      padding: 0;
      background: #ef4300;
      -moz-border-radius: 6px;
      -webkit-border-radius: 6px;
      border-radius: 6px;
      border: 1px solid #ff730e;
      -moz-box-shadow: $buttonBshadow;
      -webkit-box-shadow: $buttonBshadow;
      box-shadow: $buttonBshadow;
      font-family: $fontPTSans;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, .1);
      -o-transition: $transition;
      -moz-transition: $transition;
      -webkit-transition: $transition;
      -ms-transition: $transition;
      &:hover {
        -moz-box-shadow: $buttonHoverBshadow;
        -webkit-box-shadow: $buttonHoverBshadow;
        box-shadow: $buttonHoverBshadow;
      }
      &:active {
        -moz-box-shadow: $buttonActiveBshadow;
        -webkit-box-shadow: $buttonActiveBshadow;
        box-shadow: $buttonActiveBshadow;
        border: 0px solid #ef4300;
      }
    }
  }
}
</style>


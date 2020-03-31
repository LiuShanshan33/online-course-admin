<template>
  <div class="login-container">
    <div class="top">
      <div class="container">
        <div>
          <img class="login-logo" src="../_login/components/image/logo@2x.png">
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">欢迎登录系统</h3>
            <hr class="title-hr" style="color:#EEEEEE;">
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="账号"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <!-- <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span> -->
            </el-form-item>
          </el-tooltip>
          <el-button :loading="loading" type="primary" class="login-btn" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <div class="container">
        <div class="login-footer">
          <span>2020-毕业设计</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import { login } from '@/api/user'
export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value) && !'') {
        // this.$message.error('请输入账号')
        // callback(new Error('账号或密码输入有误，请重新输入'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!validUsername(value) && value.length < 6) {
        callback(new Error('账号或密码输入有误，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'ad123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (this.loginForm.username.length === 0) {
        this.$message.error('请输入账号')
        return
      }
      if (this.loginForm.password.length === 0) {
        this.$message.error('请输入密码')
        return
      }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // this.$store.dispatch('user/login', this.loginForm)
          //   .then(() => {
          //     this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          //     this.loading = false
          //   })
          //   .catch(() => {
          //     this.loading = false
          //   })
          login(this.loginForm.username, this.loginForm.password).then(res => {
            console.log(res, 'res')

            this.$store.dispatch('user/login', res)

            // this.$store.dispatch('user/logout', res)

            this.loading = false
            this.$message.success('登录成功')
            // 登录成功后跳转到工作台首页
            this.$router.push('/Home/working')
          }).catch((e) => {
            // this.$message.error('账号/密码不正确请重新输入')
            // new Error('账号或密码输入有误，请重新输入')
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #333333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      background:none !important;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding-top: 5px;
      // color:#333333;
      // height: 47px;
      // caret-color: #fff;

      // &:-webkit-autofill {
      //   // box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: none !important;
      // }
    }
  }

  .el-form-item {
    color: #454545;
    width:320px;
    height:40px;
    background:rgba(255,255,255,1);
    border-radius:3px;
    border:1px solid rgba(221,221,221,1);
    margin: 25px;
  }
  .el-button{
    width:320px !important;
    height:40px;
    background:#3f5e96;
    border-radius:3px;
    margin: 20px 25px;
  }
  .el-form-item__error {
    height:20px;
    font-size:14px;
    font-family:STSongti-SC-Bold,STSongti-SC;
    font-weight:bold;
    color:rgba(245,34,45,1);
    line-height:20px;
}
}
</style>

<style lang="scss" scoped>
$bg:#102E4F;
$dark_gray:#889aa4;
$light_gray:#eee;
.html{
  overflow: hidden;
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color:#FFFFFF;
  overflow: hidden;
  .container{
    width:1100px;
    height:100%;
    margin:auto;
  }
  .top{
    height:72px;
    .login-logo{
      float:left;
      width: 258px;
      height: 46px;
      position: relative;
      top: 14px;
    }
  }

  .middle{
    height:600px;
    background-image: url('../_login/components/image/背景图2.png');
    background-color: $bg;
    background-position: center;
    .login-form {
      float:right;
      background:rgba(248,251,251,1);
      box-shadow:0px 3px 8px 0px rgba(0,0,0,0.5);
      border-radius:3px;
      position: relative;
      width: 370px;
      height: 318px;
      overflow: hidden;
      margin:141px auto;

    }
  }
  .svg-container {
    padding: 0px 0px 3px 15px;
    color: #CCCCCC;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      margin: 14px auto 16px 25px;
      font-weight: bold;
      font-size:22px;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
    .title-hr{
      width:80%;
      margin:0 auto;
      border: 0;
      height: 1px;
      background: #EEEEEE;
    }
  }
  .login-btn{
    font-size:15px;
    font-family:STSongti-SC-Bold,STSongti-SC;
    font-weight:bold;
    color:rgba(255,255,255,1);
  }
  .bottom{
    width: 100%;
    margin:17px 36%;
    .login-footer{
      font-size:12px;
      font-family:STSongti-SC-Regular,STSongti-SC;
      font-weight:400;
      color:rgba(51,51,51,1);
    }
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

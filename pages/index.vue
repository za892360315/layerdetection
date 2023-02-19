<template>
  <div class="login-container">
    <div slot="header" class="title">
      <img src="../assets/images/logo.png" width="884" height="106" alt />
    </div>
    <div class="login-middle">
      <div class="logon-pic">
        <img src="../assets/images/map.png" width="825" height="485" />
      </div>
      <el-card class="login-form">
        <!-- <el-tabs v-model="activeName" class="login-tabs" stretch>
        <el-tab-pane label="用户登录" name="normal"> -->
        <el-form
          :hide-required-asterisk="true"
          ref="loginForm"
          :rules="loginRules"
          :model="loginForm"
          auto-complete="on"
          label-position="right"
        >
          <el-form-item
            prop="username"
            label="输入用户名"
            style="font-size: 18px"
          >
            <input
              class="el-input__inner"
              v-model="loginForm.username"
              placeholder="请输入您的用户名"
              name="username"
              type="text"
              auto-complete="on"
            />
              <!-- <template slot="prepend"><i class="el-icon-user"></i></template> -->
          </el-form-item>

          <el-form-item prop="password" label="输入密码">
            <input
              class="el-input__inner"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入您的密码"
              show-password
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
              <!-- <template slot="prepend"><i class="el-icon-lock"></i></template -->
              <!-- / > -->
          </el-form-item>
          <el-form-item prop="code" label="输入验证码">
            <input
              class="el-input__inner"
              v-model="loginForm.code"
              placeholder="请输入右侧图片的验证码"
              name="code"
              tabindex="2"
              auto-complete="on"
            />
            <canvas
              width="150"
              height="42"
              id="initCode"
              class="initCode"
            ></canvas>
          </el-form-item>
        </el-form>
        <!-- </el-tab-pane>
      </el-tabs> -->
        <el-button
          :loading="loading"
          type="success"
          style="margin-top: 20px; font-size: 18px"
          @click.native.prevent="handleLogin"
          >登 录</el-button
        >
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getPublicKey,
  getLoginToken,
  getUserInfo2token,
  getUserProfile,
  getUserOrgsById,
} from '@/services/api/user'
import { setUserId, setUserInfo, setuserOrgs } from '@/modules/auth'
import Captcha from 'captcha-mini'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (rule && value.length < 3) {
        callback(new Error('密码长度不能少于3位'))
      } else {
        callback()
      }
    }
    return {
      falg: false,
      authCode: '',
      activeName: 'normal',
      // 登录Form
      loginTitle: '',
      loginForm: {
        username: '',
        password: '',
        code: '',
        grant_type: 'password',
        scope: '',
        client_id: '',
        client_secret: '1q2w3e*',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的用户名' },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
      },
      passwordType: 'password',
      loading: false,
    }
  },
  mounted() {
    this.initCode()
  },
  methods: {
    // 图片验证码
    initCode() {
      let captcha1 = new Captcha()
      captcha1.draw(document.querySelector('#initCode'), (r) => {
        this.authCode = r
        this.authCode.toLowerCase()
      })
    },
    /** 登录 */
    handleLogin() {
      this.loading = true
      this.$store.commit('oneMap/setIsFocusHandle', false)
      this.$store.commit('oneMap/setIsRouterHandle', false)
      this.$store.commit('oneMap/setIsScopesHandle', false)
      this.$store.commit('oneMap/setIsFocusSee', false)
      this.$store.commit('oneMap/setIsRouterSee', false)
      this.$store.commit('oneMap/setIsScopesSee', false)
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          if (
            this.authCode.toLowerCase() === this.loginForm.code.toLowerCase()
          ) {
            try {
              const submitForm = new FormData()
              const res = await getPublicKey() // 获取公钥
              if (res) {
                const JSEncrypt = require('@/modules/jsencrypt.js')
                const encrypt = new JSEncrypt()
                encrypt.setPublicKey(res)
                const win = window

                const scopeList = win.login.scope
                const scope = scopeList.join(' ')
                const password = encrypt.encrypt(this.loginForm.password) // 密码加密
                submitForm.append('username', this.loginForm.username)
                submitForm.append('password', password)
                submitForm.append('grant_type', 'password')
                submitForm.append('scope', scope)
                submitForm.append('client_id', win.login.client_id)
                submitForm.append('client_secret', '1q2w3e*')
              }
              const token = await getLoginToken(submitForm)
              if (token === undefined) {
                this.loading = false
                this.$message.error('登录失败，请联系管理员！')
              } else {
                const tokenInfo = await getUserInfo2token(token)
                const userID = tokenInfo.sub
                setUserId(userID)
                const userInfo = await getUserProfile(userID)
                userInfo.role = tokenInfo.role
                userInfo.id = userID
                console.log("setUserInfo",userInfo)
                setUserInfo(userInfo)
                const userOrgsResult = await getUserOrgsById(userID)
                setuserOrgs(userOrgsResult)
                this.loading = false
                this.$router.push({ path: '/home' })
                return true
              }
            } catch (error) {
              this.loading = false
              this.$message.error('登录失败，请联系管理员！')
            }
          } else {
            this.loading = false
            this.$message.error('请输入正确验证码！')
          }
        } else {
          this.loading = false
          this.$message.error('请输入用户名或密码！')
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login-container {
  .el-card {
    background-color: transparent;
    border: none;
  }

  .el-card__header {
    border-bottom: none;
  }

  .el-card.is-always-shadow,
  .el-card.is-hover-shadow:focus,
  .el-card.is-hover-shadow:hover {
    box-shadow: none;
  }

  .el-button--success,
  .el-button--success:focus,
  .el-button--success:hover {
    display: flex;
    justify-content: center;
    color: #ffffff;
    background-image: linear-gradient(90deg, #665ede 45%, #b833d4 100%);
    border-radius: 10px;
    opacity: 0.8;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    // height: 60px;
    font-size: 18px;
    width: 388px;
    margin: 67px 75px;
    // margin-left: 17%;
  }

  .el-button--primary,
  .el-button--primary:focus,
  .el-button--primary:hover {
    display: flex;
    justify-content: center;
    margin-left: 17%;
    color: #044ba7;
    // background: linear-gradient(to right, #5bcddc, #69f2e8);
    background: #ffffff;
    border: 1px solid #044ba7;
    border-radius: 4px;
    font-size: 18px;
    height: 40px;
    width: 66%;
  }
}

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #000;
$cursor: #999999;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;

    &::first-line {
      color: #a2a2a2;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;

.login-container {
  position: absolute;
  min-height: 100%;
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/backgroud.png');
  background-size: 100% 100%;
  background-position: center;
  text-align: center;
  overflow: hidden;

  .login-middle {
    display: flex;

    .logon-pic {
      // flex: 1;
      margin-top: 133px;
      margin-left: 188px;
    }

    .login-form {
      // flex: 1;
      position: relative;
      top: 0;
      left: 0%;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      border: none;
      width: 530px;
      height: 610px;
      max-width: 100%;
      max-height: 100%;
      margin: 0 auto;
      margin-top: 28px;
      overflow: hidden;
    }
  }

  .title {
    margin-top: 90px;
    font-size: 38px;
    font-family: monospace;
    font-weight: bold;
  }

  .initCode {
    position: absolute;
    right: 0;
    top: 32px;
  }

  // .show-pwd {
  //   position: absolute;
  //   background-image: url('../assets/images/biyan.png');
  //   right: 10px;
  //   top: 7px;
  //   width: 23px;
  //   height: 20px;
  //   font-size: 18px;
  //   color: $dark_gray;
  //   cursor: pointer;
  //   user-select: none;
  // }

  // .view {
  //   position: absolute;
  //   background: url('../assets/images/zhengyan.png') no-repeat;
  //   width: 25px;
  //   height: 25px;
  //   right: 10px;
  //   top: 7px;
  //   font-size: 18px;
  //   color: $dark_gray;
  //   cursor: pointer;
  //   user-select: none;
  // }
  /deep/ .el-input-group__prepend {
    background: #ff000000;
    border: none;
  }
  
  
  // input::placeholder {
  //     color: red !important;
  // }
  /deep/ .el-input__inner {
    background: transparent;
    width: 388px;
    border: 0;
    border-bottom: 1px solid #fff;
    border-radius: 0px;
    color: #fff;
    padding: 0;
    font-size: 18px;
    &::placeholder {
      color: #dfdfdd !important;
    }
  }

  /deep/ .el-form {
    margin: 67px 75px;
    height: auto !important;
    .el-form-item__label {
      font-size: 18px;
      color: #afb7e1;
      width: 102px !important;
      text-align: left !important;
    }
  }
  /deep/ .el-card__body {
    padding: 0;
  }
}
</style>

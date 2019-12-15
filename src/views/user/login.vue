<template>
  <div class='container'>
    <van-nav-bar style="background:none;border:none" left-arrow @click-left="$router.back()" ></van-nav-bar>
      <div class="login_box">
        <van-cell-group>
          <van-field v-model.trim="loginForm.mobile" @blur="checkMobile"  placeholder="请输入用户名" />
          <van-field v-model.trim="loginForm.code" @blur="checkCode" center clearable
            placeholder="请输入短信验证码"
          >
          <van-button  slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
      </van-cell-group>
      <van-button  class="login_btn" type="primary" size="large" @click="login"  loading-text="加载中...">立即登录</van-button>
      </div>
    </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    // 校验手机号
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.$notify({
          type: 'warning',
          message: '请输入手机号',
          duration: 1500
        })
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 提示
        this.$notify({
          type: 'warning',
          message: '请输入正确手机号',
          duration: 1500
        })
        return false
      }
      return true
    },
    // 校验验证码
    checkCode () {
      if (!this.loginForm.code) {
        this.$notify({
          type: 'warning',
          message: '请输入验证码',
          duration: 1500
        })
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        // 提示
        this.$notify({
          type: 'warning',
          message: '正确验证码为6未有效数字',
          duration: 1500
        })
        return false
      }
      return true
    },
    async login () {
      if (this.checkMobile() && this.checkCode()) {
        try {
          let res = await login(this.loginForm)
          this.setUser(res)
          this.$router.push(this.$route.query.redirectUrl || '/user')
          this.$toast.success('登录成功')
        } catch (e) {
          // 错误提示
          this.$toast.fail('用户名或验证码错误')
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-nav-bar::after{
  border: none
}
.container /deep/ .van-cell-group{
  border-radius: 5px;
  overflow: hidden;
}
.container /deep/ .van-cell-group,
.van-cell{
  background-color: rgba(0, 0, 0, .1);
}
.container /deep/ .van-cell{
  padding-left:0 ;
  input{
    height: 35px;
    padding-left: 15px;
    color: #fff;
  }
  button{
    background: none;
    border:none;
  }
  input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:#fff;
  }
  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
   color:#fff;
  }
  input::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
   color:#fff;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color:#fff;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color:    #909;
  }
}

.container /deep/ .van-cell-group::after{
  border:none
}
.container /deep/ .van-cell::after{
  width: 100%;
  left: 0;
  border-bottom:1px solid #fff;
}
.container{
  width: 100%;
  height: 100%;
  background: url('./login.jpg') no-repeat center;
  background-size: 100% 100%;
}
.login_box{
  margin-top: 35%;
  padding:0 40px;
  .login_btn{
    width: 97%;
    margin: 15px auto;
    height: 40px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 40px;
    background:#00a8ff;
    border-radius: 18px;
    overflow: hidden;
    border:none;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { getSocket } from '@/utils/socket'

// 用户仓库
const userStore = useUserStore()

// 路由
const router = useRouter()

// 登录
const loginForm = ref({
  username: '',
  password: ''
})
const login = () => {
  if (loginForm.value.username === '') {
    ElMessage({
      message: '请输入用户名',
      type: 'error',
      grouping: true
    })
    return
  }
  if (loginForm.value.password === '') {
    ElMessage({
      message: '请输入密码',
      type: 'error',
      grouping: true
    })
    return
  }

  request
    .post('/api/user/login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    .then((res: any) => {
      if (res.code === 1) {
        ElMessage.success({
          message: res.message
        })
        userStore.setUserInfo(res.data)

        let socket = getSocket()
        socket.emit('login', {
          token: userStore.token
        })

        router.replace('/chat')
      } else {
        ElMessage.error({
          message: res.message,
          grouping: true
        })
      }
    })
}

// 注册
const registerPanelVisable = ref(false)
const registerForm = ref({
  username: '',
  password: '',
  phone: '',
  code: ''
})
const register = () => {
  if (registerForm.value.username === '') {
    ElMessage({
      message: '请输入用户名',
      type: 'error',
      grouping: true
    })
    return
  }
  if (registerForm.value.password === '') {
    ElMessage({
      message: '请输入密码',
      type: 'error',
      grouping: true
    })
    return
  }
  if (registerForm.value.phone === '') {
    ElMessage({
      message: '请输入手机号',
      type: 'error',
      grouping: true
    })
    return
  }
  if (registerForm.value.code === '') {
    ElMessage({
      message: '请输入验证码',
      type: 'error',
      grouping: true
    })
    return
  }
  if (registerForm.value.code !== '123456') {
    ElMessage({
      message: '验证码错误',
      type: 'error',
      grouping: true
    })
    return
  }

  request
    .post('/api/user/register', {
      username: registerForm.value.username,
      password: registerForm.value.password,
      phone: registerForm.value.phone
    })
    .then((res: any) => {
      if (res.code === 1) {
        ElMessage.success({
          message: res.message
        })
        registerForm.value.username = ''
        registerForm.value.password = ''
        registerForm.value.phone = ''
        registerForm.value.code = ''
        registerPanelVisable.value = false
      } else {
        ElMessage.error({
          message: res.message,
          grouping: true
        })
      }
    })
}
// 发送验证码
const buttonDisabled = ref(false)
const buttonText = ref('获取验证码')
const textSecond = ref(60)
const sendCode = () => {
  if (registerForm.value.phone === '') {
    ElMessage({
      message: '请输入手机号',
      type: 'error',
      grouping: true
    })
    return
  }

  ElMessage({
    message: '验证码已发送',
    type: 'success',
    grouping: true
  })
  buttonDisabled.value = true
  buttonText.value = `(${textSecond.value}s)`
  const changeButton = setInterval(() => {
    textSecond.value--
    buttonText.value = `(${textSecond.value}s)`
    if (textSecond.value <= 0) {
      clearInterval(changeButton)
      buttonText.value = '获取验证码'
      textSecond.value = 60
    }
  }, 1000)
}

// 判断用户是否已登录过
if (userStore.token) {
  router.replace('/chat')
}
</script>
<template>
  <div id="login">
    <div class="form-box">
      <div class="background">
        <div class="login-text">
          <h1 class="title">欢迎注册 极聊X</h1>
          <p class="sub-title">冲破二次元的墙壁</p>
          <img src="/images/register.jpg" alt="register.jpg" />
          <p class="text">已有账号？</p>
          <button class="change-login" @click="registerPanelVisable = false">登录</button>
        </div>
        <div class="register-text">
          <h1 class="title">欢迎登录 极聊X</h1>
          <p class="sub-title">冲破二次元的墙壁</p>
          <img src="/images/login.jpg" alt="register.jpg" />
          <p class="text">没有账号？</p>
          <el-button class="change-register" @click="registerPanelVisable = true">注册</el-button>
        </div>
      </div>

      <div class="form-block" :class="{ 'change-register-form': registerPanelVisable }">
        <div class="login-box">
          <h1 class="login-title">LOGIN</h1>
          <el-form class="login-form">
            <input
              type="text"
              name="login-username"
              class="login-username"
              id="login-username"
              v-model="loginForm.username"
              placeholder="用户名"
              autocomplete="off"
            />
            <input
              type="password"
              name="login-password"
              class="login-password"
              id="login-password"
              v-model="loginForm.password"
              placeholder="密码"
              autocomplete="off"
            />
            <el-button class="login-button" id="login-button" @click="login()"> 登录 </el-button>
            <router-link to="/forget" class="forget">忘记密码？</router-link>
          </el-form>
        </div>

        <div class="register-box">
          <h1 class="register-title">REGISTER</h1>
          <form class="register-form">
            <input
              type="text"
              name="register-username"
              class="register-username"
              id="register-username"
              v-model="registerForm.username"
              placeholder="请输入用户名"
              autocomplete="off"
            />
            <input
              type="password"
              name="register-password"
              class="register-password"
              id="register-password"
              v-model="registerForm.password"
              placeholder="请输入密码"
              autocomplete="off"
            />
            <input
              type="text"
              name="register-phone"
              class="register-phone"
              id="register-phone"
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              autocomplete="off"
            />
            <div class="register-code-pane">
              <input
                type="text"
                name="register-code"
                class="register-code"
                id="register-code"
                v-model="registerForm.code"
                placeholder="请输入验证码"
                autocomplete="off"
              />
              <input
                type="button"
                :value="buttonText"
                class="register-code-button"
                id="register-code-button"
                @click="sendCode"
                :disabled="buttonDisabled"
              />
            </div>
            <input value="注册" class="register-button" id="register-button" @click="register" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import '@/assets/scss/login/';
</style>

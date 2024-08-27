<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import router from '@/router'

// 忘记密码
const forgetForm = ref({
  username: '',
  password: '',
  phone: '',
  code: ''
})
const forget = () => {
  if (forgetForm.value.username === '') {
    ElMessage({
      message: '请输入用户名',
      type: 'error',
      grouping: true
    })
    return
  }
  if (forgetForm.value.password === '') {
    ElMessage({
      message: '请输入密码',
      type: 'error',
      grouping: true
    })
    return
  }
  if (forgetForm.value.phone === '') {
    ElMessage({
      message: '请输入手机号',
      type: 'error',
      grouping: true
    })
    return
  }
  if (forgetForm.value.code === '') {
    ElMessage({
      message: '请输入验证码',
      type: 'error',
      grouping: true
    })
    return
  }
  if (forgetForm.value.code !== '123456') {
    ElMessage({
      message: '验证码错误',
      type: 'error',
      grouping: true
    })
    return
  }

  request
    .post('/api/user/forget', {
      username: forgetForm.value.username,
      password: forgetForm.value.password,
      phone: forgetForm.value.phone
    })
    .then((res: any) => {
      if (res.code === 1) {
        ElMessage.success({
          message: res.message
        })
        router.replace('/login')
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
  if (forgetForm.value.phone === '') {
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
</script>
<template>
  <div id="forget">
    <div class="form-box">
      <div class="background">
        <div class="login-text">
          <h1 class="title">重置密码</h1>
          <p class="sub-title">冲破二次元的墙壁</p>
          <img src="/images/forget.jpg" alt="forget.jpg" />
          <p class="text">已有账号？</p>
          <router-link to="/login" class="change-login">登录</router-link>
        </div>
      </div>

      <div class="form-block">
        <div class="forget-box">
          <h1 class="forget-title">RESET</h1>
          <form class="forget-form">
            <input
              type="text"
              name="forget-username"
              class="forget-username"
              id="forget-username"
              v-model="forgetForm.username"
              placeholder="请输入要重置的用户名"
              autocomplete="off"
            />
            <input
              type="password"
              name="forget-password"
              class="forget-password"
              id="forget-password"
              v-model="forgetForm.password"
              placeholder="请输入新密码"
              autocomplete="off"
            />
            <input
              type="text"
              name="forget-phone"
              class="forget-phone"
              id="forget-phone"
              v-model="forgetForm.phone"
              placeholder="请输入注册的手机号"
              autocomplete="off"
            />
            <div class="forget-code-pane">
              <input
                type="text"
                name="forget-code"
                class="forget-code"
                id="forget-code"
                v-model="forgetForm.code"
                placeholder="请输入验证码"
                autocomplete="off"
              />
              <input
                type="button"
                :value="buttonText"
                class="forget-code-button"
                id="forget-code-button"
                @click="sendCode"
                :disabled="buttonDisabled"
              />
            </div>
            <el-button class="reset-button" id="reset-button" @click="forget">重置密码</el-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import '@/assets/scss/forget/';
</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户token
    const token = ref('')

    // 设置用户信息
    const setUserInfo = (data: any) => {
      token.value = data.userToken
    }

    // 退出登录
    const logout = () => {
      token.value = ''
      window.location.replace('/')
    }

    return {
      token,
      setUserInfo,
      logout
    }
  },
  {
    persist: true
  }
)

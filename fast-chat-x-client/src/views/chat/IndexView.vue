<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useUserStore } from '@/stores'
import request from '@/utils/request'
import { ElMessage, ElScrollbar, ElMessageBox } from 'element-plus'
import router from '@/router'
import { formatDate, formatMessageDate } from '@/utils'
import { getSocket } from '@/utils/socket'
import UserInfo from './components/UserInfo.vue'

// socket
let socket: any

// 用户仓库
const userStore = useUserStore()

// 加载动画
const loading = ref(true)

// 用户信息
const userInfo: any = ref({
  userName: 'ACGN',
  userImg: '../ACGN.png'
})

// 消息列表
const messageList: any = ref([])
// 滚动条
const scrollbarRef: any = ref<InstanceType<typeof ElScrollbar> | null>(null)
// 文本域
const textareaInput = ref('')
// 回车发送消息
const onEnter = (event: KeyboardEvent) => {
  event.preventDefault() // 阻止默认的回车行为（换行）
  sendMessage()
}
// 发送信息
const sendMessage = () => {
  if (textareaInput.value.trim() !== '') {
    socket.emit('sendMessage', {
      from: userInfo.value.userAccount,
      name: userInfo.value.userName,
      message: textareaInput.value,
      img: userInfo.value.userImg
    })

    textareaInput.value = ''
  }
}

// 用户列表
const userList: any = ref([])

// 初始化
const initChat = () => {
  const token = userStore.token
  if (token) {
    // 获取用户信息
    request
      .get('/api/user?token=' + userStore.token)
      .then((res: any) => {
        // console.log(res)
        userInfo.value = res.data

        // 获取消息列表
        request
          .get('/api/user/message?page=' + page.value)
          .then((res: any) => {
            // console.log(res)
            messageList.value = res.data
            page.value += 1
            autoScroll()
          })
          .catch((err) => {
            console.log(err)
          })

        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    ElMessage.error('请先登录！')
    router.replace('/')
  }

  socket = getSocket()

  socket.off('message')
  socket.on('message', (data: any) => {
    console.log(data)
    // 接收信息
    if (data.type === 'message') {
      messageList.value.push(data.data)
      autoScroll()
    }
    // 获取用户列表
    if (data.type === 'userList') {
      userList.value = data.data
    }
    // 踢出
    if (data.type === 'kick') {
      ElMessage.error(data.message)
      userStore.token = ''
      router.push('/')
    }
  })

  // 加入房间
  socket.emit('joinRoom', {
    token: userStore.token
  })

  socket.off('disconnect')
  socket.on('disconnect', () => {
    ElMessage.error('与服务器断开连接！')
    router.replace('/')
  })
}

initChat()

// 自动滚动
const autoScroll = () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      scrollbarRef.value.setScrollTop(scrollbarRef.value.wrapRef.scrollHeight)
    }
  })
}

// 获取历史数据
const hasMore = ref(true)
const isLoading = ref(false)
const page = ref(1)
const fetchMessages = async () => {
  if (!hasMore.value || isLoading.value) return

  isLoading.value = true

  // 假设 `loadMoreMessages` 是一个方法从后端获取更多消息
  request
    .get('/api/user/message?page=' + page.value)
    .then(async (res: any) => {
      // console.log(res)
      const newMessages = res.data

      if (newMessages.length < 20) {
        hasMore.value = false
      }

      const changeMessage = setTimeout(() => {
        // messageList.value = [...newMessages, ...messageList.value]
        messageList.value.unshift(...newMessages)

        isLoading.value = false
        page.value += 1

        // 插入新消息后的滚动高度
        nextTick(() => {
          // 调整滚动位置
          scrollbarRef.value.scrollTo({
            // top: (103 * newMessages.length + 8)
            top: remToPx(6.4375) * newMessages.length + remToPx(0.5)
          })
        })

        clearTimeout(changeMessage)
      }, 1000)
    })
    .catch((err) => {
      console.log(err)
    })
}
// 滚动条事件
const handleScroll = () => {
  if (scrollbarRef.value.wrapRef.scrollTop == 0 && hasMore.value) {
    fetchMessages()
  }
}
const remToPx = (rem: number) => {
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
  return rem * rootFontSize
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('是否退出登录？', '提示框', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '你已退出登录'
      })
      userStore.logout()
      socket.disconnect()
    })
    .catch(() => {
      // do nothing
    })
}

// 打开用户资料
const userInfoRef: any = ref(null)
const openUserInfo = () => {
  // console.log(userInfoRef.value)
  userInfoRef.value.open()
}
</script>
<template>
  <div id="chat" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.8)">
    <div class="chat-box">
      <!-- 用户信息列表 -->
      <div class="user-info-box">
        <div class="user-box">
          <el-avatar
            class="user-img"
            :src="`/images/userimg/${userInfo?.userImg}`"
            @click="openUserInfo"
          />
          <p class="user-name">{{ userInfo?.userName }}</p>
        </div>
        <div class="user-options-box">
          <div class="user-option-box">
            <el-icon class="option-icon active"><ChatLineSquare /></el-icon>
            <el-icon class="option-icon"><User /></el-icon>
            <el-icon class="option-icon setting"><Operation /></el-icon>
          </div>
          <div class="user-message-box">
            <el-scrollbar height="100%">
              <div class="message-box active" v-for="item in 1" :key="item">
                <el-avatar class="user-img" shape="square" src="/images/ACGN.png" />
                <div class="content">
                  <div class="title">
                    <p class="name">ACGN 小屋</p>
                    <p class="time">
                      {{ formatMessageDate(messageList[messageList.length - 1]?.time) }}
                    </p>
                  </div>
                  <div class="message">
                    <p class="text">
                      {{
                        (
                          messageList[messageList.length - 1]?.name +
                          ':' +
                          messageList[messageList.length - 1]?.message
                        ).slice(0, 11)
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list-box">
        <div class="message-title">
          <p class="title">ACGN 小屋</p>
        </div>
        <div class="message-list">
          <div class="loading-text" v-if="isLoading">
            <el-icon class="is-loading"><Loading /></el-icon>加载中...
          </div>
          <el-scrollbar height="100%" ref="scrollbarRef" @scroll="handleScroll">
            <div v-for="item in messageList" :key="item.name" class="message-item">
              <el-avatar class="user-img" shape="square" :src="`/images/userimg/${item.img}`" />
              <div class="message-content">
                <div class="title">
                  <span class="name">{{ item.name }}</span
                  ><span class="time">{{ formatDate(item.time) }}</span>
                </div>
                <div class="text">
                  <p
                    class="content"
                    :class="{
                      other: item.name === userInfo.userName
                    }"
                  >
                    {{ item.message }}
                  </p>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="message-input-box">
          <div class="message-option">
            <el-tooltip class="box-item" effect="dark" content="表情" placement="top-start">
              <el-icon class="option-icon"><PictureRounded /></el-icon>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="发送图片" placement="top-start">
              <el-icon class="option-icon"><Picture /></el-icon>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="发送文件" placement="top-start">
              <el-icon class="option-icon"><Folder /></el-icon>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="语音通话" placement="top-start">
              <el-icon class="option-icon"><Phone /></el-icon>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="视频通话" placement="top-start">
              <el-icon class="option-icon"><Camera /></el-icon>
            </el-tooltip>
          </div>
          <el-input
            type="textarea"
            class="textarea"
            resize="none"
            v-model="textareaInput"
            @keydown.enter="onEnter"
          />
          <el-button type="primary" class="send-button" @click="sendMessage">发送</el-button>
        </div>
      </div>

      <!-- 账号列表 -->
      <div class="account-list-box">
        <!-- 窗口选项栏 -->
        <div class="chat-options">
          <!-- <el-button>-</el-button>
          <el-button>O</el-button>
          <el-button>X</el-button> -->
          <span class="hidden"></span>
          <span class="max"></span>
          <span class="close" @click="logout"></span>
        </div>
        <div class="account-title">
          <p class="title">在线人数：{{ userList.length }}</p>
        </div>
        <div class="account-list">
          <el-scrollbar height="100%">
            <div class="account-item" v-for="item in userList" :key="item">
              <el-avatar class="user-img" shape="square" :src="`/images/userimg/${item.img}`" />
              <div class="name">{{ item.name }}</div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <!-- 用户信息表 -->
    <UserInfo ref="userInfoRef"></UserInfo>
  </div>
</template>
<style scoped lang="scss">
@import '@/assets/scss/chat/';
</style>

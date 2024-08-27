<script setup lang="ts">
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 模态框
const dialogFormVisible = ref(false)

// 用户信息表单
const userInfoForm = ref({
  username: ''
})

// 标签长度
const labelWidth = ref(100)

// 打开模态框
const open = () => {
  dialogFormVisible.value = true
}

// 更改信息
const changeInfo = () => {
  request.post('/api/user/updateInfo', { userInfoForm: userInfoForm.value }).then((res: any) => {
    if (res.code === 1) {
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      window.location.replace('/chat')
    }
  })
}

// 导出方法
defineExpose({
  open
})
</script>
<template>
  <el-dialog v-model="dialogFormVisible" title="用户资料" width="500">
    <el-form :model="userInfoForm">
      <el-form-item label="昵称" :label-width="labelWidth">
        <el-input v-model="userInfoForm.username" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="changeInfo">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss"></style>

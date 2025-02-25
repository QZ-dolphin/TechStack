<!-- upload_avatar.vue -->
<template>

  <el-upload class="avatar-uploader" :action="GO_API_URL + '/upload'" name="ufile" :data=data :show-file-list="false"
    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
    <el-tooltip content="点击修改头像" placement="bottom" effect="customized">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-tooltip>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const GO_API_URL = import.meta.env.VITE_GO_API_URL;

const data = ref({
  'username': JSON.parse(sessionStorage.getItem('username')),
  'password': JSON.parse(sessionStorage.getItem('password')),
  'filetype': 'avatar'
})

const imageUrl = defineModel();

const handleAvatarSuccess = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // console.log(imageUrl.value) // 输出服务器返回的数据
  console.log(response) // 输出服务器返回的数据
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    // ElMessage.error('头像图片需是 JPG 或 png 格式!')
    // return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>

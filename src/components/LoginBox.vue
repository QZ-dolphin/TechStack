<template>
  <div class="login-container">
    <el-input class="input-field" v-model="username" placeholder="请输入用户名" />
    <el-input class="input-field" v-model="password" type="password" placeholder="请输入密码" show-password />
    <el-button type="primary" @click="login">
      登录<el-icon class="el-icon--right">
        <Finished />
      </el-icon>
    </el-button>
  </div>

</template>

<script setup>
  import { ref } from 'vue'
  import { Finished } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import axios from 'axios';
  const GO_API_URL = import.meta.env.VITE_GO_API_URL;

  const showLogin = defineModel('login')
  const username = defineModel('user')
  const password = ref('')
  const emit = defineEmits(['getdata'])


  async function login() {
    if (username.value.trim().length == 0) {
      ElMessage({
        type: 'error',
        message: `请输入合法用户名`,
      })
      return
    }

    const data = {
      username: username.value,
      email: "",
      password: password.value,
    }
    const response = await axios.post(`${GO_API_URL}/userlogin`, data);
    if (response.data.exits == false) {
      // 用户不存在，输入邮箱注册
      ElMessageBox.prompt('输入您的 e-mail', '新用户注册', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern:
          /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: 'Invalid Email',
      })
        .then(async ({ value }) => {
          const data_reg = {
            username: username.value,
            email: value,
            password: password.value,
          }
          const register = await axios.post(`${GO_API_URL}/userlogin`, data_reg);
          if (register.data.dul == false) {
            ElMessage({
              type: 'error',
              message: `注册失败，您的账号已超上限`,
            })
            return
          }
          else {
            ElMessage({
              type: 'success',
              message: `成功注册`,
            })
            showLogin.value = !showLogin.value
            emit('getdata');
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '输入注册',
          })
        })
    }
    else {
      // 用户存在
      if (response.data.pass == false) {
        ElMessage({
          type: 'error',
          message: `密码错误`,
        })
      }
      else {
        ElMessage({
          type: 'success',
          message: `欢迎回来`,
        })
        showLogin.value = !showLogin.value
        emit('getdata');
      }
    }
  }

</script>

<style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 35%;
    /* 确保父容器的高度被占用 */
    width: 25%;
    border: 1px solid silver;
    /* 添加灰色边框 */
    border-radius: 10px;
    /* 添加圆角 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
  }

  .input-field {
    width: 240px;
    margin-bottom: 16px;
    /* 添加输入框之间的间距 */
  }
</style>

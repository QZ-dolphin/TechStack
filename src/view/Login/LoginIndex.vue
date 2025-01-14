<template>
  <div class="loginbox">
    <my_title style="margin: 0px 20px 15px 20px;" />
    <div class="login-container">
      <el-input class="input-field" v-model="username" placeholder="请输入用户名" style="margin-top: 10px;" />
      <el-input class="input-field" v-model="password" type="password" placeholder="请输入密码" show-password />
      <el-button type="primary" @click="login">
        登录<el-icon class="el-icon--right">
          <Finished />
        </el-icon>
      </el-button>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Finished } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import my_title from '@/components/my_title.vue';
const GO_API_URL = import.meta.env.VITE_GO_API_URL;

const username = ref('')
const password = ref('')
const router = useRouter();

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
          // 成功，写入用户名，及路由
          sessionStorage.setItem('username', JSON.stringify(username.value));
          navigateToEdit();
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
      // 成功，写入用户名，及路由
      sessionStorage.setItem('username', JSON.stringify(username.value));
      navigateToEdit();
    }
  }
};

const navigateToEdit = () => {
  router.push('/edit');
};

const handleKeydown = (event) => {
  // 检查是否按下的是 回车
  if (event.key === 'Enter') {
    // 阻止默认的剪切板复制行为（可选）
    event.preventDefault();
    // 调用保存函数
    login();
  }
};

onMounted(() => {
  // 在组件挂载时添加事件监听
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // 在组件卸载时移除事件监听
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.loginbox {
  display: flex;
  flex-direction: column;
  /* 改为主轴方向为垂直 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 80vh;
  /* 继承自app的视口高度 */
  width: 100%;
  /* 宽度也设置为100%，确保内容可以居中 */
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160px;
  width: 340px;
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

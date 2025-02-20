<!-- view/login/index.vue -->
<template>
  <div class="background">
    <div class="loginbox">
      <my_title style="margin: 0px 20px 15px 20px;" />
      <div class="login-container">
        <el-input class="input-field" v-model="username" placeholder="请输入用户名" style="margin-top: 10px;" clearable
          :prefix-icon="User" />
        <el-input class="input-field" v-model="password" type="password" placeholder="请输入密码" show-password
          :prefix-icon="Unlock" />
        <div class="input-field">
          <el-input class="input-field-2" v-model="verifyCode" placeholder="请输入验证码" maxlength="4"
            :prefix-icon="Position" />
          <img class="input-field-3" :src="captchaSrc" @click="getcaptcha" style="cursor: pointer" />
        </div>

        <el-button type="primary" @click="login">
          登录<el-icon class="el-icon--right">
            <Finished />
          </el-icon>
        </el-button>
      </div>
      <emailbox v-model="emailshow"/>
    </div>
  </div>


</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Finished, Unlock, User, Position } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import my_title from '@/components/my_title.vue';
import emailbox from './components/email_box.vue';
const GO_API_URL = import.meta.env.VITE_GO_API_URL;

const username = ref('')
const password = ref('')
const verifyCode = ref('')
const verifyKey = ref('')
const captchaSrc = ref('')
const emailshow = ref(false) // 是否显示邮箱输入框

const router = useRouter();

async function getcaptcha() {
  const response = await axios.get(`${GO_API_URL}/authcode_get`);
  captchaSrc.value = response.data.img;
  verifyKey.value = response.data.key;
}

async function login() {
  if (username.value.trim().length == 0) {
    ElMessage({
      type: 'error',
      message: `请输入用户名`,
    })
    return
  }
  if (password.value.trim().length == 0) {
    ElMessage({
      type: 'error',
      message: `请输入密码`,
    })
    return
  }
  if (verifyCode.value.trim().length == 0) {
    ElMessage({
      type: 'error',
      message: `请输入验证码`,
    })
    return
  }
  sessionStorage.setItem('username', JSON.stringify(username.value));
  sessionStorage.setItem('password', JSON.stringify(password.value));
  const data = {
    username: username.value,
    email: "",
    password: password.value,
    verifyCode: verifyCode.value,
    verifyKey: verifyKey.value,
  }
  const response = await axios.post(`${GO_API_URL}/userlogin`, data);
  if (response.data.verify == false) {
    ElMessage({
      type: 'error',
      message: `验证码错误`,
    })
    getcaptcha();
    return
  }
  if (response.data.exits == false) {
    // 用户不存在，输入邮箱注册
    emailshow.value = true; // 显示邮箱输入框
    return; // 不继续执行登录逻辑
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
      // 成功路由

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
  getcaptcha(); // 获取验证码图片
  // 在组件挂载时添加事件监听
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // 在组件卸载时移除事件监听
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.background {
  background-image: url('/u902.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
  border-radius: 12px;
}

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
  height: 230px;
  width: 380px;
  border: 1px solid silver;
  /* 添加灰色边框 */
  border-radius: 10px;
  /* 添加圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影效果 */
  background-color: rgba(48, 48, 70, 0.7);
}

.input-field {
  width: 240px;
  height: 32px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  /* 添加输入框之间的间距 */
}

.input-field-2 {
  width: 155px;
  height: 32px;
  margin-right: 10px;
}

.input-field-3 {
  width: 75px;
  height: 30px;
  line-height: 30px;
  background-color: #ffffff;
  border: 1px solid rgb(220, 223, 230);
  cursor: pointer;
  transition: all ease 0.2s;
  border-radius: 4px;
  user-select: none;

  &:hover {
    border-color: #c0c4cc;
    transition: all ease 0.2s;
  }
}

.login-content-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 16px;

  .login-content-code-img {
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #ffffff;
    border: 1px solid rgb(220, 223, 230);
    cursor: pointer;
    transition: all ease 0.2s;
    border-radius: 4px;
    user-select: none;

    &:hover {
      border-color: #c0c4cc;
      transition: all ease 0.2s;
    }
  }
}
</style>

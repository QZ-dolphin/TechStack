<template>
  <el-dialog v-model="centerDialogVisible" title="新账号注册" width="380" destroy-on-close :before-close="handleClose" center
    style="background-color: rgba(255, 255, 255, 0.9);">
    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" style="width: 270px;">
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱" :disabled="isCounting" clearable :prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" style="width: 150px; margin-right: auto;"
            maxlength="6" clearable :prefix-icon="Position" />
          <el-button type="primary" @click="getVerifyCode" :disabled="isCounting" plain>
            {{ isCounting ? `${leftTime} 秒后获取` : "获取验证码" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" round @click="submitForm">
          注册<el-icon class="el-icon--right">
            <Finished />
          </el-icon>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Message, Position, Finished } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const router = useRouter();
const GO_API_URL = import.meta.env.VITE_GO_API_URL;

const centerDialogVisible = defineModel(); // 控制对话框显示隐藏
const loginFormRef = ref(null);
const loginForm = reactive({
  email: '',
  verifyCode: ''
});
const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度应为 6 位', trigger: 'blur' }
  ]
});

const leftTime = ref(0); // 倒计时时间
const isCounting = ref(false); // 是否正在倒计时

const countDown = () => {
  const interval = setInterval(() => {
    if (leftTime.value > 0) {
      leftTime.value--;
    } else {
      clearInterval(interval);
      isCounting.value = false;
    }
  }, 1000); // 每秒执行一次
};

async function getVerifyCode() {
  isCounting.value = true; // 正在倒计时
  console.log(loginForm.email); // 打印邮箱地址
  const response = await axios.post(`${GO_API_URL}/emailcode_get`, { toemail: loginForm.email });
  let send = response.data.send;
  let exits = response.data.exits;
  if (exits) {
    ElMessage({
      type: 'error',
      message: `该邮箱已注册，请重新输入！`,
    });
    isCounting.value = false;
    return;
  }
  if (!send) {
    ElMessage({
      type: 'error',
      message: `邮箱地址不正确，请重新输入！`,
    });
    return;
  }
  leftTime.value = response.data.ttl;
  if (leftTime.value != 60 * 5) {
    ElMessage({
      type: 'error',
      message: `验证码发送过于频繁，请稍后再试！`,
    });
  }
  countDown();
};

async function submitForm() {
  const valid = await loginFormRef.value.validate();
  if (valid) {
    const code_vfy = {
      toemail: loginForm.email,
      code: loginForm.verifyCode,
    }
    const response = await axios.post(`${GO_API_URL}/emailcode_vfy`, code_vfy);
    if (!response.data.vfy) {
      ElMessage({
        type: 'error',
        message: `验证码错误，请重新输入！`,
      });
      return;
    }
    const data_reg = {
      username: JSON.parse(sessionStorage.getItem('username')),
      email: loginForm.email,
      password: JSON.parse(sessionStorage.getItem('password')),
    };
    try {
      const register = await axios.post(`${GO_API_URL}/userlogin`, data_reg);
      if (!register.data.dul) {
        ElMessage({
          type: 'error',
          message: `注册失败，您的账号已超上限`,
        });
        return;
      } else {
        ElMessage({
          type: 'success',
          message: `成功注册`,
        });
        // handleClose();
        router.push('/edit');
      }
    } catch (error) {
      ElMessage({
        type: 'error',
        message: `注册过程中发生错误: ${error.message}`,
      });
    }
  } else {
    ElMessage({
      type: 'error',
      message: `邮箱/验证码 格式不正确，请重新输入！`,
    });
    return;
  }
}

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
  centerDialogVisible.value = false;
}
</script>

<style scoped></style>

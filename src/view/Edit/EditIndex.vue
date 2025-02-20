<template>
  <div class="one-line">
    <my_avatar v-model="avatar_url" />
    <div>
      <my_title style="margin: 12px 20px 0px 10px;" />
      <div style="color: gray; margin-left: 10px; ">
        &#9824; Recent Update Time: {{ updateTime }}
        <el-icon class="is-loading" style="font-size: 20px; color: red" @click="navigateToLogin">
          <SwitchButton />
        </el-icon>
      </div>
    </div>
  </div>

  <div>
    <vue-composition v-model:show="showCtx" v-model:content="userdata" />
  </div>

  <div class="center">
    <el-button v-if="!showCtx" @click="editdata" type="primary" round>
      编辑<el-icon class="el-icon--right">
        <Edit />
      </el-icon>
    </el-button>
    <el-button v-if="showCtx" @click="savedata" type="success" round>
      保存<el-icon class="el-icon--right">
        <Check />
      </el-icon>
    </el-button>
  </div>
</template>

<script setup>
  import my_avatar from '@/components/my_avatar.vue';
  import my_title from '@/components/my_title.vue';
  import VueComposition from '@/components/vue-composition.vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import axios from 'axios';
  import { Edit, Check } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';

  const GO_API_URL = import.meta.env.VITE_GO_API_URL;
  const updateTime = ref('2025/01/05 23:42');
  const userdata = ref('# Tech Stack');
  var tempuserdata = '';
  const username = ref(JSON.parse(sessionStorage.getItem('username')))
  const password = ref(JSON.parse(sessionStorage.getItem('password')))
  const showCtx = ref(false);

  const avatar_url = ref('');

  const router = useRouter();

  const navigateToLogin = () => {
    sessionStorage.removeItem('username');
    router.push('/');
  };

  async function fetchdate() {
    let data = {
      username: username.value,
      password: password.value,
    };
    const response = await axios.post(`${GO_API_URL}/userdata`, data);
    updateTime.value = response.data.updated_at;
    userdata.value = response.data.stackdata;
    if (response.data.avatar_path) { // 检查 avatar_path 是否存在
      avatar_url.value = GO_API_URL + "/" + response.data.avatar_path; // 设置 avatar_url 的值
    }
    else {
      avatar_url.value = "/favicon.ico"
    }
    console.log(userdata.value);
  }

  async function editdata() {
    showCtx.value = !showCtx.value;
    tempuserdata = userdata.value;
  }

  async function savedata() {
    showCtx.value = !showCtx.value;
    if (tempuserdata == userdata.value) {
      return;
    }
    let data = {
      username: username.value,
      password: password.value,
      userdata: userdata.value,
    };
    try {
      const response = await axios.post(`${GO_API_URL}/userupdate`, data);
      console.log('Response from POST request:', response.data);
      // 你可以在这里处理响应数据
    } catch (error) {
      console.error('Error posting data:', error);
    }
    await fetchdate();
    ElMessage({
      type: 'success',
      message: `保存成功`,
    })
  };

  const handleKeydown = (event) => {
    // 检查是否按下的是 Ctrl + S
    if (event.ctrlKey && event.key === 's') {
      // 阻止默认的行为（可选）
      if (showCtx.value === false) {
        return;
      }
      event.preventDefault();
      // 调用保存函数
      savedata();
    }
    else if (event.ctrlKey && event.key === 'd') {
      if (showCtx.value === true) {
        return;
      }
      // 阻止默认的行为（可选）
      event.preventDefault();
      // 调用保存函数
      editdata();
    }
  };

  onMounted(() => {
    fetchdate();
    // 在组件挂载时添加事件监听
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    // 在组件卸载时移除事件监听
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<style scoped>

  h1,
  p {
    font-family: Lato;
  }

  .center {
    display: grid;
    place-items: center;
    /* height: 10vh; */
    margin-top: 20px;
  }

  .one-line {
    display: flex;
    align-items: center;
  }

  .is-loading {
    cursor:pointer;
  }
</style>

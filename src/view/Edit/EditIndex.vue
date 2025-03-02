<!-- view/editpanel/index.vue -->
<template>
  <div class="page-background">
    <div class="one-line">
      <my_avatar ref="ref1" v-model="avatar_url" @click="drawer = true" />
      <div>
        <my_title style="margin: 12px 20px 0px 10px;" />
        <div style="color: gray; margin-left: 10px; ">
          &#9824; Recent Update Time: {{ updateTime }}
          <el-icon ref="ref2" class="is-loading" style="font-size: 20px; color: red" @click="navigateToLogin">
            <SwitchButton />
          </el-icon>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center;">
      <vue-composition v-model:show="showCtx" v-model:content="userdata" />
    </div>


    <div class="center">
      <el-button ref="ref3" v-if="!showCtx" @click="editdata" type="primary" round>
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

    <my_drawer v-model:drawer="drawer" v-model:avatar_url="avatar_url" />

    <el-tour v-model="tour">
      <el-tour-step :target="ref3?.$el" title="编辑文档" description="Click to edit your document" />
      <el-tour-step :target="ref1?.$el" title="用户信息" description="Click to edit your information" />
      <el-tour-step :target="ref2?.$el" title="退出登录" description="Click to log out" />
    </el-tour>
  </div>
</template>

<script setup>
  import my_title from '@/components/my_title.vue';
  import my_avatar from './components/my_avatar.vue';
  import my_drawer from './components/my_drawer.vue';
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
  const username = ref(JSON.parse(sessionStorage.getItem('username')));
  const password = ref(JSON.parse(sessionStorage.getItem('password')));
  const showCtx = ref(false);
  const avatar_url = ref('');

  const ref1 = ref(null); // 引用 VueComposition 组件实例
  const ref2 = ref(null);
  const ref3 = ref(null);
  const tour = ref(true); // 控制 Tour 的显示与隐藏

  const drawer = ref(false);

  const router = useRouter();

  function tour_set() {
    let temp_tour = sessionStorage.getItem('tour');
    if(!temp_tour){
      tour.value = true;
      sessionStorage.setItem('tour', true);
      return;
    }
    else {
      tour.value = false;
      return;
    }

  };

  const navigateToLogin = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
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
    tour_set();
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

  .page-background::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/bgp.png');
    background-size: cover;
    /* 确保背景图片覆盖整个页面 */
    background-position: center;
    /* 居中显示 */
    background-repeat: no-repeat;
    /* 防止重复 */
    opacity: 0.2; /* 控制透明度，0.1 ~ 1 之间 */
    z-index: -1;
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
    cursor: pointer;
  }
</style>

<template>
  <div class="title">
    Personal Tech Stack
  </div>
  <div style="color: gray; margin-left: 25px; height: 2vh;">
    &#9824; Recent Update Time: {{ updateTime }}
  </div>
  <div>
    <component :is="component" v-model:show="showCtx" v-model:content="userdata"></component>
  </div>
  <div class="center">
    <el-button v-if="!showCtx" @click="editdata" type="primary" :icon="Edit" circle />
    <el-button v-if="showCtx" @click="savedata" type="success" :icon="Check" circle />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import VueComposition from './components/vue-composition.vue';
import axios from 'axios';
import { Edit, Check } from '@element-plus/icons-vue';

const GO_API_URL = import.meta.env.VITE_GO_API_URL;
const updateTime = ref('2025/01/05 23:42');
const userdata = ref('# Tech Stack');
var tempuserdata = '';
const type = ref('composition');

const component = computed(() => ({
  composition: VueComposition,
}[type.value]));

const showCtx = ref(false);

async function fetchdate() {
  let params = '?username=' + 'dongqingzhen';
  const response = await axios.get(GO_API_URL + '/userdata' + params);
  console.log(response.data);
  updateTime.value = response.data.updated_at;
  userdata.value = response.data.stackdata;
  console.log(userdata.value);
}

onMounted( async () => {
  await fetchdate();
});

function editdata(){
  showCtx.value = !showCtx.value;
  tempuserdata = userdata.value;
}

async function savedata(){
  showCtx.value = !showCtx.value;
  if(tempuserdata==userdata.value){
    return;
  }
  let data = {
    username: 'dongqingzhen',
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
}
</script>

<style scoped>

h1,
p {
  font-family: Lato;
}

.center {
  display: grid;
  place-items: center;
  height: 10vh;
}

.title {
  /* width: 300px; */
  margin: 20px 20px 0px 20px;
  font-size: 30px;
  /* font-family: 'CustomFont', Arial, sans-serif; */
  height: 5vh;
  background-image: -webkit-linear-gradient(left, blue, #66ffff 10%, #cc00ff 20%, #CC00CC 30%, #CCCCFF 40%, #00FFFF 50%, #CCCCFF 60%, #CC00CC 70%, #CC00FF 80%, #66FFFF 90%, blue 100%);
  background-clip: text; /* 标准属性 */
  -webkit-text-fill-color: transparent;
  /* -webkit-background-clip: text; */
  background-size: 200% 100%;
  /* -webkit-background-size: 200% 100%; */
  animation: masked-animation 4s linear infinite;
  /* -webkit-animation: masked-animation 4s linear infinite; */
}

@keyframes masked-animation {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>

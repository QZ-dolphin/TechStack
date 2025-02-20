<!-- my_avatar.vue -->
<template>
  <div style="margin: 20px 0px 5px 15px;">
    <el-avatar class="my-avatar" shape="square" :size="imgSize" :fit="fit" :src="avatar_url" @click="drawer = true"/>
  </div>
  <el-drawer v-model="drawer" :direction="direction" :size="size" :with-header="false">
    <h4>用户：{{ username }}</h4>
    <upload_avatar v-model="avatar_url"/>
    <div class="txt">点击头像以更新</div>
  </el-drawer>
</template>

<script setup>
import upload_avatar from './upload_avatar.vue';
import { ref } from 'vue';
const imgSize = ref('large');
const avatar_url = defineModel(); // 获取头像URL

const direction = ref('ltr');
const size = ref('15%');
const fit = ref('cover');

const drawer = ref(false);

const username = ref(JSON.parse(sessionStorage.getItem('username')));
</script>

<style scoped>
.txt {
  margin-top: 10px;
  font-size: 14px;
  color: dimgray;
}

.my-avatar {
  cursor: pointer;
}
</style>

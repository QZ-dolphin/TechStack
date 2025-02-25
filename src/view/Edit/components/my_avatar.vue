<!-- my_avatar.vue -->
<template>
  <div style="margin: 20px 0px 5px 15px;">
    <el-avatar class="my-avatar" shape="square" :size="imgSize" :fit="fit" :src="avatar_url"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const imgSize = ref('large');
const avatar_url = defineModel(); // 获取头像URL
const fit = ref('cover');
</script>

<style scoped>
.my-avatar {
  cursor: pointer;
}
</style>

<!--my_drawer.vue-->
<template>
  <el-drawer v-model="drawer" :direction="direction" :size="size" :with-header="false">
    <h4>用户：{{ username }}</h4>
      <upload_avatar v-model="avatar_url" />
  </el-drawer>

</template>

<script setup>
import upload_avatar from './upload_avatar.vue';
import { ref } from 'vue';

const direction = ref('ltr');
const size = ref('15%');

const username = ref(JSON.parse(sessionStorage.getItem('username')));

const drawer = defineModel("drawer")
const avatar_url = defineModel("avatar_url");
</script>

<style scoped>
</style>

<template>
  <div class="title">
    Personal Tech Stack
  </div>
  <div>
    <component :is="component" v-model="showCtx"></component>
  </div>
  <div class="center">
    <el-button v-if="!showCtx" @click="showCtx = !showCtx" type="primary" :icon="Edit" circle />
    <el-button v-if="showCtx" @click="showCtx = !showCtx" type="success" :icon="Check" circle />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueComposition from './components/vue-composition.vue';
import { Edit, Check } from '@element-plus/icons-vue'


const type = ref('composition');
const component = computed(() => ({
  composition: VueComposition,
}[type.value]));

const showCtx = ref(false);

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
  margin: 20px 20px;
  font-size: 30px;
  font-family: fantasy, cursive, "Papyrus", serif;
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

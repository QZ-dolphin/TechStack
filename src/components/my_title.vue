<!-- components/my_title.vue -->
<template>
  <div class="title">
    Personal Tech Stack
  </div>
</template>

<style scoped>
.title {
  font-size: 30px;
  /* font-family: 'CustomFont', Arial, sans-serif; */
  background-image: -webkit-linear-gradient(left, blue, #66ffff 10%, #cc00ff 20%, #CC00CC 30%, #CCCCFF 40%, #00FFFF 50%, #CCCCFF 60%, #CC00CC 70%, #CC00FF 80%, #66FFFF 90%, blue 100%);
  background-clip: text;
  /* 标准属性 */
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

<template>
  <div class="center-container">
    <svg class="pics" ref="svgRef"></svg>
    <MarkdownEditor class="text" v-if="showCtx" v-model="content" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUpdated } from 'vue';
  import { Markmap } from 'markmap-view';
  import { transformer } from './markmap.js';
  import MarkdownEditor from './MarkdownEditor.vue';

  const showCtx = defineModel()
  const svgRef = ref();
  const content = ref('');
  let mm;

  const update = () => {
    const { root } = transformer.transform(content.value);
    mm.setData(root);
    mm.fit();
  };

  onMounted(async () => {
    try {
      const response = await fetch('/1.txt');
      if (response.ok) {
        content.value = await response.text();
        console.log(content.value)
      } else {
        console.error('Failed to load file:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching file:', error);
    }
    mm = Markmap.create(svgRef.value);
    update();
  });

  onUpdated(update);


</script>

<style scoped>
  .center-container {
    display: flex;
    /* 使用 Flexbox 布局 */
    justify-content: space-between;
    /* 使子元素在主轴上两端对齐 */
    width: 100%;
    /* 确保容器宽度占满父元素 */
    align-items: center;
    /* 使子元素在交叉轴上居中对齐 */
    height: 80vh;
    /* 如果需要垂直居中，确保容器有高度 */
    width: 100%;
  }

  .pics {
    flex: 1;
    /* 使子元素等分剩余空间 */
    margin: 0 10px;
    /* 添加一些间距 */
    height: 100%
  }

  .text {
    flex: 1;
    /* 使子元素等分剩余空间 */
    margin: 0 10px;
    /* 添加一些间距 */
    height: 80%;
  }
</style>

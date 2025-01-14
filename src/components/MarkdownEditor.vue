<template>
  <div class="editor-container">
    <Codemirror v-model="code" placeholder="Code goes here..." :style="{ height: '100%' }" :autofocus="true"
      :tabSize="2" :extensions="extensions" @update:modelValue="change" />
  </div>
</template>

<script setup>
  import { Codemirror } from 'vue-codemirror';
  import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
  import { languages } from '@codemirror/language-data';
  import { oneDark } from '@codemirror/theme-one-dark';

  const code = defineModel()
  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }), // 支持 Markdown 语法和代码块
    oneDark,
  ];

  // const change = (newCode) => {
  //   console.log('Code changed:', newCode);
  // };
</script>

<style>
  .editor-container {
    border: 1px solid var(--border-color, #ccc);
    border-radius: 8px;
    overflow: hidden;
  }
</style>

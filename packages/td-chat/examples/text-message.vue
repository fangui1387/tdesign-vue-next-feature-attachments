<template>
  <t-chat-content :content="ask" variant="base" role="user"></t-chat-content>
</template>

<script>
export default {
  name: 'TextMessageExample',
  data() {
    return {
      ask: `import TDesign from 'tdesign-vue'; // 引入tdesign组件库
app.use(TDesign).use(router).mount('#app');`,
    };
  },
};
</script>

<style scoped></style>

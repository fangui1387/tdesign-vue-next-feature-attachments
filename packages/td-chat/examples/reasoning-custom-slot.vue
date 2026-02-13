<template>
  <t-chat ref="chatRef" layout="both" style="height: 150px" :clear-history="false" :reverse="false">
    <t-chat-reasoning v-model="collapsed" expand-icon-placement="right" @expand-change="handleChange">
      <template #header>
        <t-chat-loading text="思考中..." />
      </template>
      <t-chat-content :content="reasoning" />
    </t-chat-reasoning>
  </t-chat>
</template>

<script>
export default {
  name: 'ReasoningCustomSlotExample',
  data() {
    return {
      collapsed: false,
      reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。`,
    };
  },
  created() {
    setTimeout(() => {
      this.collapsed = true;
    }, 3000);
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>

<style lang="less" scoped></style>

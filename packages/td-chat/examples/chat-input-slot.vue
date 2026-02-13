<template>
  <t-chat-input :stop-disabled="loading" placeholder="请输入消息..." @send="inputEnter" @stop="handleStop">
    <template #suffixIcon>
      <t-button theme="default" variant="text" size="large" class="btn"> 发送 </t-button>
    </template>
  </t-chat-input>
</template>

<script>
export default {
  name: 'ChatInputSlotExample',
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handleStop() {
      this.loading = false;
    },
    inputEnter(inputValue) {
      if (this.loading) {
        return;
      }
      if (!inputValue) return;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    },
  },
};
</script>

<style lang="less">
.btn {
  color: var(--td-text-color-disabled);
  border: none;
  &:hover {
    color: var(--td-brand-color-hover);
    border: none;
    background: none;
  }
}
</style>

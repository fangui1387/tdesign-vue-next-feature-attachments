<template>
  <t-space direction="vertical">
    <t-chat-action
      content="这是要复制的内容"
      :operation-btn="['copy', 'replay', 'good', 'bad']"
      @operation="handleOperation"
    />
    <t-chat-action
      content="这是要复制的内容"
      :operation-btn="['copy', 'good']"
      :is-good="true"
      @operation="handleOperation"
    />
    <t-chat-action
      content="这是要复制的内容"
      :operation-btn="['replay']"
      :disabled="true"
      @operation="handleOperation"
    />
  </t-space>
</template>

<script>
export default {
  name: 'ChatActionExample',
  methods: {
    handleOperation(type, context) {
      console.log('操作类型:', type);
      this.$message.success(`执行了 ${type} 操作`);
    },
  },
};
</script>

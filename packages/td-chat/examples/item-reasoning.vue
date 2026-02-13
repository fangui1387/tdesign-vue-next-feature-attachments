<template>
  <t-chat-item
    avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
    name="AI"
    role="assistant"
    datetime="今天16:38"
    :content="markdownContent"
    :reasoning="{
      expandIconPlacement: 'right',
      onExpandChange: handleChange,
      collapsePanelProps: {
        header: renderHeader(true),
        content: renderReasoningContent(reasoningContent),
      },
    }"
    variant="text"
  ></t-chat-item>
</template>

<script>
import { CheckCircleIcon } from 'tdesign-icons-vue';

export default {
  name: 'ItemReasoningExample',
  components: {
    TIconCheckCircle: CheckCircleIcon,
  },
  data() {
    return {
      reasoningContent: `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。`,
      markdownContent: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立。`,
    };
  },
  methods: {
    handleChange(value) {
      console.log('handleChange', value);
    },
    renderHeader(flag) {
      if (flag) {
        return <t-chat-loading text="思考中..." />;
      }
      return (
        <div style="display:flex;align-items:center">
          <CheckCircleIcon style={{ color: 'var(--td-success-color-5)', fontSize: '20px', marginRight: '8px' }} />
          <span>思考完成</span>
        </div>
      );
    },
    renderReasoningContent(content) {
      return <t-chat-content content={content} role="assistant" />;
    },
  },
};
</script>

<style scoped></style>

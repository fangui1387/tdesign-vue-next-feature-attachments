<template>
  <t-chat ref="chatRef" layout="both" style="height: 550px" :clear-history="false" :reverse="false">
    <template v-for="(item, index) in chatList1">
      <t-chat-item
        :key="index"
        :avatar="item.avatar"
        :name="item.name"
        :role="item.role"
        :datetime="item.datetime"
        :text-loading="index === 0 && loading"
        :variant="item.role === 'assistant' ? 'outline' : 'base'"
      >
        <template #content>
          <t-chat-reasoning
            v-if="item.reasoning?.length > 0"
            expand-icon-placement="right"
            :collapse-panel-props="{
              header: renderHeader(index === 0 && isStreamLoad, item),
              content: renderReasoningContent(item.reasoning),
            }"
            @expand-change="handleChange"
          >
          </t-chat-reasoning>
          <t-chat-content v-if="item.content.length > 0" :content="item.content" />
        </template>
      </t-chat-item>
    </template>
  </t-chat>
</template>

<script>
import { CheckCircleIcon } from 'tdesign-icons-vue';

export default {
  name: 'ReasoningCustomExample',
  components: {
    TIconCheckCircle: CheckCircleIcon,
  },
  data() {
    return {
      loading: false,
      isStreamLoad: false,
      chatList1: [
        {
          avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
          name: '自己',
          datetime: '今天16:38',
          content: '牛顿第一定律是否适用于所有参考系？',
          role: 'user',
          reasoning: '',
        },
        {
          avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
          name: 'TDesignAI',
          datetime: '今天16:38',
          reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。`,
          content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立。`,
          role: 'assistant',
        },
      ],
    };
  },
  methods: {
    handleChange(value, { index }) {
      console.log('handleChange', value, index);
    },
    renderHeader(flag, item) {
      if (flag) {
        return <t-chat-loading text="思考中..." />;
      }
      const endText = item.duration ? `已深度思考(用时${item.duration}秒)` : '已深度思考';
      return (
        <div style="display:flex;align-items:center">
          <CheckCircleIcon style={{ color: 'var(--td-success-color-5)', fontSize: '20px', marginRight: '8px' }} />
          <span>{endText}</span>
        </div>
      );
    },
    renderReasoningContent(reasoningContent) {
      return <t-chat-content content={reasoningContent} role="assistant" />;
    },
  },
};
</script>

<style lang="less" scoped></style>

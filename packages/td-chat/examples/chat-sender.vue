<template>
  <t-chat-sender
    v-model="inputValue"
    placeholder="请输入消息..."
    :loading="loading"
    @send="handleSend"
    @stop="handleStop"
  >
    <template #prefix>
      <t-button variant="text" size="small">
        <t-icon-attachment />
        附件
      </t-button>
    </template>
  </t-chat-sender>
</template>

<script>
import { AttachmentIcon } from 'tdesign-icons-vue';

export default {
  name: 'ChatSenderExample',
  components: {
    TIconAttachment: AttachmentIcon,
  },
  data() {
    return {
      inputValue: '',
      loading: false,
    };
  },
  methods: {
    handleSend(value) {
      console.log('发送消息:', value);
      this.loading = true;
      
      // 模拟发送
      setTimeout(() => {
        this.loading = false;
        this.inputValue = '';
      }, 2000);
    },
    handleStop() {
      console.log('停止发送');
      this.loading = false;
    },
  },
};
</script>

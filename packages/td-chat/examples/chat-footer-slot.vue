<template>
  <t-chat
    :clear-history="false"
    :reverse="true"
    :text-loading="loading"
    :data="[
      {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'TDesignAI',
        datetime: '今天16:38',
        content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
        role: 'assistant',
      },
      {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '自己',
        datetime: '今天16:38',
        content: '南极的自动提款机叫什么名字？',
        role: 'user',
      },
    ]"
  >
    <template #name="{ item, index }">
      {{ item.name }}
    </template>
    <template #avatar="{ item, index }">
      <t-avatar size="large" shape="circle" :image="item.avatar" />
    </template>
    <template #datetime="{ item, index }">
      {{ item.datetime }}
    </template>
    <template #content="{ item, index }">
      <t-chat-content :content="item.content" />
    </template>
    <template #footer>
      <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="handleStop"> </t-chat-input>
    </template>
  </t-chat>
</template>

<script>
export default {
  name: 'ChatFooterSlotExample',
  data() {
    return {
      loading: false,
      isStreamLoad: false,
    };
  },
  methods: {
    handleStop() {
      this.isStreamLoad = false;
    },
    inputEnter(inputValue) {
      if (this.isStreamLoad) {
        return;
      }
      if (!inputValue) return;
      this.isStreamLoad = true;
      this.loading = true;
      // 模拟接口请求响应中
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      // 模拟流式数据加载中
      setTimeout(() => {
        this.isStreamLoad = false;
      }, 5000);
    },
  },
};
</script>

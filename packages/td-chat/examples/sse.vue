<template>
  <t-chat layout="both" style="height: 600px" :clear-history="false">
    <template v-for="(item, index) in chatList">
      <t-chat-item :key="index" :content="item" avatar="https://tdesign.gtimg.com/site/avatar.jpg" variant="base"> </t-chat-item>
    </template>
    <template #footer>
      <t-space align="center">
        <t-button block variant="outline" @click="addMessage">非流式消息</t-button>
        <t-button v-if="!startRender" block variant="outline" @click="toggleStartRender">流式消息</t-button>
        <t-button v-else block variant="dashed" @click="stop">停止</t-button>
      </t-space>
    </template>
  </t-chat>
</template>

<script>
export default {
  name: 'SSEExample',
  data() {
    return {
      chatList: new Array(5).fill('牛顿第一定律是否适用于所有参考系？'),
      startRender: false,
    };
  },
  watch: {
    chatList: {
      deep: true,
      handler(newVal) {
        if (!this.startRender) return;
        const timer = setTimeout(() => {
          this.chatList = [newVal[0] + '逐字渲染', ...newVal.slice(1)];
        }, 100);
        return () => {
          clearTimeout(timer);
        };
      },
    },
    startRender(newVal) {
      if (!newVal) return;
    },
  },
  methods: {
    addMessage() {
      this.chatList = [
        `牛顿第一定律并不适用于所有参考系，它只适用于惯性参考系。在质点不受外力作用时，能够判断出质点静止或作匀速直线运动的参考系一定是惯性参考系，因此只有在惯性参考系中牛顿第一定律才适用`,
        ...this.chatList,
      ];
    },
    toggleStartRender() {
      this.startRender = true;
    },
    stop() {
      this.startRender = false;
    },
  },
};
</script>

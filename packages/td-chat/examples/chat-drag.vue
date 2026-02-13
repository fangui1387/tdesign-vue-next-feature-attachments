<template>
  <t-space align="center">
    <t-button theme="primary" @click="visibleModelessDrag = true">AI助手可拖拽</t-button>
  </t-space>
  <t-dialog
    v-model="visibleModelessDrag"
    :footer="false"
    header="AI助手"
    mode="modeless"
    draggable
    :on-confirm="() => (visibleModelessDrag = false)"
  >
    <template #body>
      <t-chat
        layout="single"
        style="height: 600px"
        :data="chatList"
        :clear-history="chatList.length > 0 && !isStreamLoad"
        @clear="clearConfirm"
      >
        <template #actions="{ item, index }">
          <t-chat-action
            :content="item.content"
            :operation-btn="['good', 'bad', 'replay', 'copy']"
            @operation="handleOperation"
          />
        </template>
        <template #footer>
          <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop"> </t-chat-input>
        </template>
      </t-chat>
    </template>
  </t-dialog>
</template>

<script>
import { MockSSEResponse } from './mock-data/sseRequest';

export default {
  name: 'ChatDragExample',
  data() {
    return {
      visibleModelessDrag: false,
      fetchCancel: null,
      loading: false,
      isStreamLoad: false,
      chatList: [
        {
          content: `模型由 <span>hunyuan</span> 变为 <span>GPT4</span>`,
          role: 'model-change',
        },
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
      ],
    };
  },
  methods: {
    handleOperation(type, options) {
      console.log('handleOperation', type, options);
    },
    clearConfirm() {
      this.chatList = [];
    },
    onStop() {
      if (this.fetchCancel) {
        this.fetchCancel.controller.close();
        this.loading = false;
      }
    },
    inputEnter(inputValue) {
      if (this.isStreamLoad) {
        return;
      }
      if (!inputValue) return;
      const params = {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '自己',
        datetime: new Date().toDateString(),
        content: inputValue,
        role: 'user',
      };
      this.chatList.unshift(params);
      // 空消息占位
      const params2 = {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'TDesignAI',
        datetime: new Date().toDateString(),
        content: '',
        role: 'assistant',
      };
      this.chatList.unshift(params2);
      this.handleData(inputValue);
    },
    async fetchSSE(fetchFn, options) {
      const response = await fetchFn();
      const { success, fail, complete } = options;
      if (!response.ok) {
        complete?.(false, response.statusText);
        fail?.();
        return;
      }
      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      const bufferArr = [];
      let dataText = '';
      const event = { data: null };

      reader.read().then(function processText({ done, value }) {
        if (done) {
          complete?.(true);
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        const buffers = chunk.toString().split(/\r?\n/);
        bufferArr.push(...buffers);
        let i = 0;
        while (i < bufferArr.length) {
          const line = bufferArr[i];
          if (line) {
            dataText = dataText + line;
            event.data = dataText;
          }
          if (event.data) {
            const jsonData = JSON.parse(JSON.stringify(event));
            success(jsonData);
            event.data = null;
          }
          bufferArr.splice(i, 1);
        }
        reader.read().then(processText);
      });
    },
    async handleData() {
      this.loading = true;
      this.isStreamLoad = true;
      const lastItem = this.chatList[0];
      const mockedData = `这是一段模拟的流式字符串数据。`;
      const mockResponse = new MockSSEResponse(mockedData);
      this.fetchCancel = mockResponse;
      await this.fetchSSE(
        () => {
          return mockResponse.getResponse();
        },
        {
          success: (result) => {
            this.loading = false;
            const { data } = result;
            lastItem.content += data;
          },
          complete: (isOk, msg) => {
            if (!isOk || !lastItem.content) {
              lastItem.role = 'error';
              lastItem.content = msg;
            }
            this.isStreamLoad = false;
            this.loading = false;
          },
        }
      );
    },
  },
};
</script>

<style scoped lang="less">
::-webkit-scrollbar-thumb {
  background-color: var(--td-scrollbar-color);
}
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: var(--td-scrollbar-hover-color);
}
::-webkit-scrollbar-track {
  background-color: var(--td-scroll-track-color);
}
</style>

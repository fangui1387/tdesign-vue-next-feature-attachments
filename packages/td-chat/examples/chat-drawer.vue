<template>
  <t-space align="center">
    <t-button theme="primary" @click="visible = true">AI助手悬窗展示</t-button>
  </t-space>
  <t-drawer v-model="visible" :footer="false" size="480px" :close-btn="true" class="drawer-box">
    <template #header>
      <t-avatar size="32px" shape="circle" image="https://tdesign.gtimg.com/site/chat-avatar.png"></t-avatar>
      <span class="title">Hi, &nbsp;我是AI</span>
    </template>
    <t-chat
      layout="both"
      :clear-history="chatList.length > 0 && !isStreamLoad"
      @clear="clearConfirm"
    >
      <template v-for="(item, index) in chatList">
        <t-chat-item
          :key="index"
          :role="item.role"
          :content="item.content"
          :text-loading="index === 0 && loading"
          :variant="getStyle(item.role)"
        >
          <template v-if="!isStreamLoad" #actions>
            <t-chat-action
              :is-good="isGood"
              :is-bad="isBad"
              :content="item.content"
              @operation="handleOperation"
            />
          </template>
        </t-chat-item>
      </template>
      <template #footer>
        <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop"> </t-chat-input>
      </template>
    </t-chat>
  </t-drawer>
</template>

<script>
import { MockSSEResponse } from './mock-data/sseRequest';

export default {
  name: 'ChatDrawerExample',
  data() {
    return {
      visible: false,
      fetchCancel: null,
      loading: false,
      isStreamLoad: false,
      isGood: false,
      isBad: false,
      chatList: [
        {
          content: `模型由 <span>hunyuan</span> 变为 <span>GPT4</span>`,
          role: 'model-change',
        },
        {
          content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
          role: 'assistant',
        },
        {
          content: '南极的自动提款机叫什么名字？',
          role: 'user',
        },
      ],
    };
  },
  methods: {
    getStyle(role) {
      if (role === 'assistant') {
        return 'outline';
      }
      if (role === 'user') {
        return 'base';
      }
      if (role === 'error') {
        return 'text';
      }
      return 'text';
    },
    handleOperation(type, options) {
      const { index } = options;
      if (type === 'good') {
        this.isGood = !this.isGood;
        this.isBad = false;
      } else if (type === 'bad') {
        this.isBad = !this.isBad;
        this.isGood = false;
      } else if (type === 'replay') {
        const userQuery = this.chatList[index + 1].content;
        this.inputEnter(userQuery);
      }
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
        content: inputValue,
        role: 'user',
      };
      this.chatList.unshift(params);
      // 空消息占位
      const params2 = {
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

<style lang="less">
::-webkit-scrollbar-thumb {
  background-color: var(--td-scrollbar-color);
}
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: var(--td-scrollbar-hover-color);
}
::-webkit-scrollbar-track {
  background-color: var(--td-scroll-track-color);
}
.title {
  margin-left: 16px;
  font-size: 20px;
  color: var(--td-text-color-primary);
  font-weight: 600;
  line-height: 28px;
}
.drawer-box {
  .t-drawer__header {
    padding: 32px;
  }
  .t-drawer__body {
    padding: 30px 32px;
  }
  .t-drawer__close-btn {
    right: 32px;
    top: 32px;
    background-color: var(--td-bg-color-secondarycontainer);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    .t-icon {
      font-size: 20px;
    }
  }
}
</style>

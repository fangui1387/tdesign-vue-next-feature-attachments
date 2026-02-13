<template>
  <div class="chat-box">
    <t-chat
      ref="chatRef"
      :clear-history="chatList.length > 0 && !isStreamLoad"
      :data="chatList"
      :text-loading="loading"
      :is-stream-load="isStreamLoad"
      style="height: 600px"
      @scroll="handleChatScroll"
      @clear="clearConfirm"
    >
      <template #content="{ item, index }">
        <t-chat-reasoning v-if="item.reasoning && item.reasoning.length > 0" expand-icon-placement="right">
          <template #header>
            <t-chat-loading v-if="isStreamLoad && item.content.length === 0" text="思考中..." />
            <div v-else style="display: flex; align-items: center">
              <t-icon-check-circle style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px" />
              <span>已深度思考</span>
            </div>
          </template>
          <t-chat-content v-if="item.reasoning.length > 0" :content="item.reasoning" />
        </t-chat-reasoning>
        <t-chat-content v-if="item.content.length > 0" :content="item.content" />
      </template>
      <template #actions="{ item, index }">
        <t-chat-action
          :content="item.content"
          :operation-btn="['good', 'bad', 'replay', 'copy']"
          @operation="handleOperation"
        />
      </template>
      <template #footer>
        <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop" />
      </template>
    </t-chat>
    <t-button v-show="isShowToBottom" variant="text" class="bottomBtn" @click="backBottom">
      <div class="to-bottom">
        <t-icon-arrow-down />
      </div>
    </t-button>
  </div>
</template>

<script>
import { MockSSEResponse } from './mock-data/sseRequest-reasoning';
import { ArrowDownIcon, CheckCircleIcon } from 'tdesign-icons-vue';

export default {
  name: 'BaseExample',
  components: {
    TIconArrowDown: ArrowDownIcon,
    TIconCheckCircle: CheckCircleIcon,
  },
  data() {
    return {
      fetchCancel: null,
      loading: false,
      isStreamLoad: false,
      isShowToBottom: false,
      chatList: [
        {
          content: '模型由<span>hunyuan</span>变为<span>GPT4</span>',
          role: 'model-change',
          reasoning: '',
        },
        {
          avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
          name: 'TDesignAI',
          datetime: '今天16:38',
          reasoning: '',
          content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
          role: 'assistant',
          duration: 10,
        },
        {
          avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
          name: '自己',
          datetime: '今天16:38',
          content: '南极的自动提款机叫什么名字？',
          role: 'user',
          reasoning: '',
        },
      ],
    };
  },
  methods: {
    backBottom() {
      this.$refs.chatRef.scrollToBottom({
        behavior: 'smooth',
      });
    },
    handleChatScroll({ e }) {
      const scrollTop = e.target.scrollTop;
      this.isShowToBottom = scrollTop < 0;
    },
    clearConfirm() {
      this.chatList = [];
    },
    handleOperation(type, options) {
      console.log('handleOperation', type, options);
    },
    onStop() {
      if (this.fetchCancel) {
        this.fetchCancel.controller.close();
        this.loading = false;
        this.isStreamLoad = false;
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
      
      const params2 = {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'TDesignAI',
        datetime: new Date().toDateString(),
        content: '',
        reasoning: '',
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

      const processText = ({ done, value }) => {
        if (done) {
          complete?.(true);
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        const buffers = chunk.toString().split(/\r?\n/);
        
        buffers.forEach((buffer) => {
          if (buffer.trim()) {
            try {
              const jsonData = JSON.parse(buffer);
              success(jsonData);
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        });
        
        reader.read().then(processText);
      };
      
      reader.read().then(processText);
    },
    async handleData() {
      this.loading = true;
      this.isStreamLoad = true;
      const lastItem = this.chatList[0];
      
      const mockedData = {
        reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。`,
        content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立。以下是关键点：\n\n### **1. 牛顿第一定律的核心**\n- **内容**：物体在不受外力（或合力为零）时，将保持静止或匀速直线运动状态。`,
      };
      
      const mockResponse = new MockSSEResponse(mockedData);
      this.fetchCancel = mockResponse;
      
      await this.fetchSSE(
        () => mockResponse.getResponse(),
        {
          success: (result) => {
            this.loading = false;
            lastItem.reasoning += result.delta.reasoning_content || '';
            lastItem.content += result.delta.content || '';
          },
          complete: (isOk, msg) => {
            if (!isOk) {
              lastItem.role = 'error';
              lastItem.content = msg;
              lastItem.reasoning = msg;
            }
            lastItem.duration = 20;
            this.isStreamLoad = false;
            this.loading = false;
          },
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.chat-box {
  position: relative;
  
  .bottomBtn {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: 210px;
    padding: 0;
    border: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08), 
                0px 16px 24px 2px rgba(0, 0, 0, 0.04),
                0px 6px 30px 5px rgba(0, 0, 0, 0.05);
  }
  
  .to-bottom {
    width: 40px;
    height: 40px;
    border: 1px solid #dcdcdc;
    box-sizing: border-box;
    background: var(--td-bg-color-container);
    border-radius: 50%;
    font-size: 24px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .t-icon {
      font-size: 24px;
    }
  }
}
</style>

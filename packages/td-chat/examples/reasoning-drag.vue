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
        <template v-for="(item, index) in chatList">
          <t-chat-item
            :key="index"
            :avatar="item.avatar"
            :name="item.name"
            :role="item.role"
            :datetime="item.datetime"
            :text-loading="index === 0 && loading"
            :content="item.content"
            :reasoning="{
              expandIconPlacement: 'right',
              onExpandChange: handleChange,
              collapsePanelProps: {
                header: renderHeader(index === 0 && isStreamLoad && !item.content, item),
                content: renderReasoningContent(item.reasoning),
              },
            }"
          >
          </t-chat-item>
        </template>
        <template #footer>
          <t-chat-sender
            v-model="inputValue"
            :loading="isStreamLoad"
            :textarea-props="{ placeholder: '请输入消息...' }"
            @stop="onStop"
            @send="inputEnter"
          >
            <template #prefix>
              <div class="model-select">
                <t-tooltip :visible="allowToolTip" content="切换模型" trigger="hover">
                  <t-select
                    v-model="selectValue"
                    :options="selectOptions"
                    value-type="object"
                    @focus="allowToolTip = false"
                  ></t-select>
                </t-tooltip>
                <t-button class="check-box" :class="{ 'is-active': isChecked }" variant="text" @click="checkClick">
                  <t-icon-system-sum />
                  <span>深度思考</span>
                </t-button>
              </div>
            </template>
          </t-chat-sender>
        </template>
      </t-chat>
    </template>
  </t-dialog>
</template>

<script>
import { MockSSEResponse } from './mock-data/sseRequest-reasoning';
import { SystemSumIcon, CheckCircleIcon } from 'tdesign-icons-vue';

export default {
  name: 'ReasoningDragExample',
  components: {
    TIconSystemSum: SystemSumIcon,
    TIconCheckCircle: CheckCircleIcon,
  },
  data() {
    return {
      fetchCancel: null,
      loading: false,
      isStreamLoad: false,
      visibleModelessDrag: false,
      inputValue: '',
      selectOptions: [
        { label: '默认模型', value: 'default' },
        { label: '深度思考', value: 'deepseek-r1' },
        { label: '混元', value: 'hunyuan' },
      ],
      selectValue: { label: '默认模型', value: 'default' },
      allowToolTip: false,
      isChecked: false,
      chatList: [
        {
          content: `模型由<span>hunyuan</span>变为<span>GPT4</span>`,
          role: 'model-change',
          reasoning: '',
        },
        {
          avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
          name: 'TDesignAI',
          datetime: '今天16:38',
          reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。`,
          content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立。`,
          role: 'assistant',
          duration: 10,
        },
        {
          avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
          name: '自己',
          datetime: '今天16:38',
          content: '牛顿第一定律是否适用于所有参考系？',
          role: 'user',
          reasoning: '',
        },
      ],
    };
  },
  methods: {
    checkClick() {
      this.isChecked = !this.isChecked;
    },
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
    clearConfirm() {
      this.chatList = [];
    },
    onStop() {
      if (this.fetchCancel) {
        this.fetchCancel.controller.close();
        this.loading = false;
        this.isStreamLoad = false;
      }
    },
    inputEnter() {
      if (this.isStreamLoad) {
        return;
      }
      if (!this.inputValue) return;
      const params = {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '自己',
        datetime: new Date().toDateString(),
        content: this.inputValue,
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
      this.handleData(this.inputValue);
      this.inputValue = '';
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

      reader.read().then(function processText({ done, value }) {
        if (done) {
          complete?.(true);
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        const buffers = chunk.toString().split(/\r?\n/);
        const jsonData = JSON.parse(buffers);
        success(jsonData);
        reader.read().then(processText);
      });
    },
    async handleData() {
      this.loading = true;
      this.isStreamLoad = true;
      const lastItem = this.chatList[0];
      const mockedData = {
        reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。`,
        content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立。`,
      };
      const mockResponse = new MockSSEResponse(mockedData);
      this.fetchCancel = mockResponse;
      await this.fetchSSE(
        () => {
          return mockResponse.getResponse();
        },
        {
          success: (result) => {
            console.log('success', result);
            this.loading = false;
            lastItem.reasoning += result.delta.reasoning_content;
            lastItem.content += result.delta.content;
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

<style lang="less">
.model-select {
  display: flex;
  align-items: center;
  .t-select {
    width: 112px;
    height: var(--td-comp-size-m);
    margin-right: var(--td-comp-margin-s);
    .t-input {
      border-radius: 32px;
      padding: 0 15px;
    }
    .t-input.t-is-focused {
      box-shadow: none;
    }
  }
  .check-box {
    width: 112px;
    height: var(--td-comp-size-m);
    border-radius: 32px;
    border: 0;
    background: var(--td-bg-color-component);
    color: var(--td-text-color-primary);
    box-sizing: border-box;
    flex: 0 0 auto;
    .t-button__text {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        margin-left: var(--td-comp-margin-xs);
      }
    }
  }
  .check-box.is-active {
    border: 1px solid var(--td-brand-color-focus);
    background: var(--td-brand-color-light);
    color: var(--td-text-color-brand);
  }
}
</style>

<template>
  <div :class="COMPONENT_NAME">
    <chat
      ref="chatRef"
      :data="messages"
      :animation="animation"
      :layout="layout"
      :reverse="reverse"
      :auto-scroll="autoScroll"
      :default-scroll-to="defaultScrollTo"
      :show-scroll-button="showScrollButton"
      :text-loading="textLoading"
      :is-stream-load="isStreamLoad"
      @clear="handleClear"
      @scroll="handleScroll"
    >
      <template #default>
        <slot name="empty" />
      </template>
      <template #actionbar="{ item, index }">
        <slot name="actionbar" :item="item" :index="index" />
      </template>
      <template #name="{ item, index }">
        <slot name="name" :item="item" :index="index" />
      </template>
      <template #avatar="{ item, index }">
        <slot name="avatar" :item="item" :index="index" />
      </template>
      <template #datetime="{ item, index }">
        <slot name="datetime" :item="item" :index="index" />
      </template>
      <template #content="{ item, index }">
        <slot name="content" :item="item" :index="index" />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </chat>

    <chat-sender
      ref="senderRef"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="senderDisabled"
      :loading="isLoading"
      :footer-prefix="footerPrefix"
      :suffix="suffix"
      :textarea-props="textareaProps"
      :attachments-props="attachmentsProps"
      @send="handleSend"
      @stop="handleStop"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template #footerPrefix>
        <slot name="senderPrefix" />
      </template>
      <template #suffix>
        <slot name="senderSuffix" />
      </template>
    </chat-sender>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chat from './chat.vue';
import ChatSender from './chat-sender.vue';
import { usePrefixClass } from '../composables/usePrefixClass';
import { ChatEngine } from '../chat-engine';
import { ChatMessagesData, ChatServiceConfig } from '../types';

export default Vue.extend({
  name: 'TChatbot',
  components: {
    Chat,
    ChatSender,
  },
  props: {
    /** 动画效果 */
    animation: {
      type: String,
      default: 'skeleton',
    },
    /** 对话布局 */
    layout: {
      type: String,
      default: 'both',
    },
    /** 是否倒序 */
    reverse: {
      type: Boolean,
      default: true,
    },
    /** 是否自动滚动 */
    autoScroll: {
      type: Boolean,
      default: true,
    },
    /** 默认滚动位置 */
    defaultScrollTo: {
      type: String,
      default: 'bottom',
    },
    /** 是否显示滚动按钮 */
    showScrollButton: {
      type: Boolean,
      default: true,
    },
    /** 输入框占位符 */
    placeholder: {
      type: String,
      default: '请输入消息...',
    },
    /** 初始消息 */
    initialMessages: {
      type: Array as () => ChatMessagesData[],
      default: () => [],
    },
    /** 服务配置 */
    serviceConfig: {
      type: Object as () => ChatServiceConfig,
      required: true,
    },
    /** 发送器前置内容 */
    footerPrefix: {
      type: [String, Function],
    },
    /** 发送器后置内容 */
    suffix: {
      type: [String, Function],
    },
    /** Textarea 属性 */
    textareaProps: {
      type: Object,
    },
    /** 附件属性 */
    attachmentsProps: {
      type: Object,
    },
  },
  data() {
    return {
      messages: [] as ChatMessagesData[],
      inputValue: '',
      isLoading: false,
      textLoading: false,
      isStreamLoad: false,
      chatEngine: null as ChatEngine | null,
      unsubscribe: null as (() => void) | null,
    };
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chatbot', this);
    },
    senderDisabled(): boolean {
      return this.isLoading;
    },
  },
  watch: {
    serviceConfig: {
      immediate: true,
      handler(newConfig: ChatServiceConfig) {
        if (newConfig) {
          this.initChatEngine();
        }
      },
    },
  },
  mounted() {
    this.initChatEngine();
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    initChatEngine() {
      if (!this.serviceConfig) return;

      // 清理旧的订阅
      if (this.unsubscribe) {
        this.unsubscribe();
      }

      // 创建新的 ChatEngine
      this.chatEngine = new ChatEngine();
      this.chatEngine.init(this.serviceConfig, this.initialMessages);

      // 订阅消息变化
      this.unsubscribe = this.chatEngine.subscribe((messages, status) => {
        this.messages = [...messages];
        this.isLoading = status === 'pending' || status === 'streaming';
        this.textLoading = status === 'pending';
        this.isStreamLoad = status === 'streaming';
      });
    },
    handleSend(value: string) {
      if (!value.trim() || !this.chatEngine) return;

      this.chatEngine.sendUserMessage({ prompt: value });
      this.inputValue = '';

      this.$emit('send', value);
    },
    handleStop() {
      if (this.chatEngine) {
        this.chatEngine.abortChat();
      }
      this.$emit('stop');
    },
    handleChange(value: string) {
      this.$emit('change', value);
    },
    handleFocus(value: string, context: { e: FocusEvent }) {
      this.$emit('focus', value, context);
    },
    handleBlur(value: string, context: { e: FocusEvent }) {
      this.$emit('blur', value, context);
    },
    handleClear(context: { e: MouseEvent }) {
      if (this.chatEngine) {
        this.chatEngine.clearMessages();
      }
      this.$emit('clear', context);
    },
    handleScroll(context: { e: Event }) {
      this.$emit('scroll', context);
    },
    // 实例方法
    scrollToBottom(params?: { behavior?: 'auto' | 'smooth' }) {
      const chatRef = this.$refs.chatRef as any;
      if (chatRef && chatRef.scrollToBottom) {
        chatRef.scrollToBottom(params);
      }
    },
    focus() {
      const senderRef = this.$refs.senderRef as any;
      if (senderRef && senderRef.focus) {
        senderRef.focus();
      }
    },
    blur() {
      const senderRef = this.$refs.senderRef as any;
      if (senderRef && senderRef.blur) {
        senderRef.blur();
      }
    },
    regenerate() {
      if (this.chatEngine) {
        this.chatEngine.regenerateAIMessage();
      }
    },
  },
});
</script>

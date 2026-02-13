<template>
  <div style="margin-top: -18px; height: 408px; display: flex; flex-direction: column">
    <t-chat
      ref="listRef"
      :clear-history="false"
      layout="both"
    >
      <t-chat-item
        v-for="(message, idx) in messages"
        :key="message.id"
        v-bind="messageProps[message.role]"
        :role="message.role"
        :content="message.content"
        :avatar="message.avatar"
        :name="message.name"
        :reasoning="message.reasoning"
      >
        <template #content>
           <!-- Content rendering logic -->
           <template v-if="Array.isArray(message.content)">
             <template v-for="(item, index) in message.content">
               <template v-if="item.type === 'reasoning'">
                 <div :key="`reasoning-${index}`" class="reasoning-wrapper">
                    <!-- Reasoning rendering if needed, or ToolCalls -->
                    <template v-for="(subItem, subIndex) in item.data">
                       <div :key="`toolcall-${index}-${subIndex}`" class="toolcall-wrapper">
                         <CustomToolCallRenderer
                           v-if="subItem.type === 'toolcall'"
                           :tool-call="subItem.data"
                           :status="subItem.status"
                         />
                       </div>
                    </template>
                 </div>
               </template>
               <template v-else-if="item.type === 'text'">
                  <div :key="`text-${index}`">{{ item.data }}</div>
               </template>
             </template>
           </template>
           <template v-else>
             {{ message.content }}
           </template>
        </template>

        <template #actions>
          <t-chat-action
            v-if="isAIMessage(message) && message.status === 'complete'"
            :operation-btn="getChatActionBar(idx === messages.length - 1)"
            :content="getMessageContentForCopy(message)"
            :is-good="message.comment === 'good'"
            :is-bad="message.comment === 'bad'"
            @operation="(name) => actionHandler(name, { message, idx })"
          />
        </template>
      </t-chat-item>
    </t-chat>

    <t-chat-sender
      ref="inputRef"
      v-model="inputValue"
      placeholder="请输入内容"
      :loading="senderLoading"
      @change="inputChangeHandler"
      @send="sendHandler"
      @stop="stopHandler"
    >
      <template #suffix="{ renderPresets }">
         <RenderVNodes :vnodes="renderPresets ? renderPresets([]) : []" />
      </template>
    </t-chat-sender>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, h } from 'vue';
import {
  isAIMessage,
  getMessageContentForCopy,
  AGUIAdapter,
  useChat,
  Chat as TChat,
  ChatItem as TChatItem,
  ChatSender as TChatSender,
  ChatAction as TChatAction,
} from '@jump-mp/td-chat';
import { MessagePlugin } from 'tdesign-vue';
import CustomToolCallRenderer from './components/Toolcall.vue';

// Helper component to render VNodes
const RenderVNodes = defineComponent({
  functional: true,
  props: ['vnodes'],
  render: (h, ctx) => ctx.props.vnodes
});

export default defineComponent({
  name: 'Demo',
  components: {
    TChat,
    TChatItem,
    TChatSender,
    TChatAction,
    CustomToolCallRenderer,
    RenderVNodes,
  },
  setup() {
    const listRef = ref<any>(null);
    const inputRef = ref<any>(null);
    const inputValue = ref<string>('AG-UI协议的作用是什么');
    const loadingHistory = ref<boolean>(false);

    const { chatEngine, messages, status } = useChat({
      defaultMessages: [],
      chatServiceConfig: {
        endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-simple`,
        protocol: 'agui',
        stream: true,
        onStart: (chunk: any) => {
          console.log('onStart', chunk);
        },
        onComplete: (aborted: boolean, params: RequestInit, event: any) => {
          console.log('onComplete', aborted, params, event);
        },
        onError: (err: Error | Response) => {
          console.error('Chatservice Error:', err);
        },
        onAbort: async () => {},
        onRequest: (innerParams: any) => {
          const { prompt } = innerParams;
          return {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
              uid: 'agent_uid',
              prompt,
            }),
          };
        },
      },
    });

    const senderLoading = computed(() => {
      if (status.value === 'pending' || status.value === 'streaming') {
        return true;
      }
      return false;
    });

    // Load history
    const loadHistoryMessages = async () => {
      loadingHistory.value = true;
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/conversation/history?type=simple`);
        const result = await response.json();
        if (result.success && result.data) {
          const newMessages = AGUIAdapter.convertHistoryMessages(result.data);
          chatEngine.value?.setMessages(newMessages);
          listRef.value?.scrollToBottom();
        }
      } catch (error) {
        console.error('加载历史消息出错:', error);
        MessagePlugin.error('加载历史消息出错');
      } finally {
        loadingHistory.value = false;
      }
    };

    const clearMessages = () => {
      chatEngine.value?.clearMessages();
      MessagePlugin.success('已清空消息');
    };

    const messageProps = {
      user: {
        variant: 'base',
        placement: 'right',
      },
      assistant: {
        placement: 'left',
        chatContentProps: {
          thinking: {
            maxHeight: 300,
          },
          reasoning: {
            maxHeight: 300,
            defaultCollapsed: false,
          },
        },
      },
    } as any;

    const getChatActionBar = (isLast: boolean) => {
      let filterActions = ['replay', 'good', 'bad', 'copy'];
      if (!isLast) {
        filterActions = filterActions.filter((item) => item !== 'replay');
      }
      return filterActions;
    };

    const actionHandler = (name: string, { message, idx }: { message: any; idx: number }) => {
      switch (name) {
        case 'replay': {
          chatEngine.value?.regenerateAIMessage();
          return;
        }
        case 'good':
        case 'bad':
          if (idx !== undefined && messages.value[idx]) {
            const curMessage = message;
            curMessage.comment = curMessage.comment === name ? '' : name;
          }
          break;
        default:
          console.log('触发action', name, 'data', message);
      }
    };

    const sendUserMessage = async (requestParams: any) => {
      await chatEngine.value?.sendUserMessage(requestParams);
      listRef.value?.scrollToBottom();
    };

    const inputChangeHandler = (value: string) => {
      inputValue.value = value;
    };

    const sendHandler = async (params: string) => {
      if (senderLoading.value) {
        MessagePlugin.error('回答输出中，请稍后操作或点击停止回答');
      } else {
        await sendUserMessage({ prompt: params });
        inputValue.value = '';
      }
    };

    const stopHandler = () => {
      chatEngine.value?.abortChat();
    };

    return {
      listRef,
      inputRef,
      inputValue,
      loadingHistory,
      messages,
      senderLoading,
      messageProps,
      isAIMessage,
      getMessageContentForCopy,
      getChatActionBar,
      actionHandler,
      inputChangeHandler,
      sendHandler,
      stopHandler,
    };
  },
});
</script>

<style scoped>
.toolcall-wrapper {
  margin: 8px 0;
}
</style>

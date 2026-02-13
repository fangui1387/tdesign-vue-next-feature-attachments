import _Chat from './components/chat.vue';
import _ChatItem from './components/chat-item.vue';
import _ChatInput from './components/chat-input.vue';
import _ChatContent from './components/chat-content.vue';
import _ChatReasoning from './components/chat-reasoning.vue';
import _ChatLoading from './components/chat-loading.vue';
import _ChatAction from './components/chat-action.vue';
import _ChatSender from './components/chat-sender.vue';
import _ChatMessage from './components/chat-message.vue';
import _ChatMarkdown from './components/chat-markdown.vue';
import _Chatbot from './components/chatbot.vue';
import _Attachments from './components/attachments.vue';
import _ChatThinking from './components/chat-thinking.vue';
import _ChatSearchContent from './components/chat-search-content.vue';
import _ChatSuggestionContent from './components/chat-suggestion-content.vue';
import _ToolCallRenderer from './components/toolcall-renderer.vue';

import { withInstall } from './utils';

import {
  TdChatProps,
  TdChatItemProps,
  TdChatContentProps,
  TdChatActionProps,
  TdChatInputProps,
  TdChatSenderProps,
  TdChatReasoningProps,
  TdChatLoadingProps,
  ChatMessagesData,
  ChatServiceConfig,
  ChatRequestParams,
} from './types';

import './style';

export * from './types';
export * from './utils';
export * from './utils/adapter';
export { ChatEngine, agentToolcallRegistry, stateManager } from './chat-engine';

export type ChatProps = TdChatProps;
export type ChatItemProps = TdChatItemProps;
export type ChatContentProps = TdChatContentProps;
export type ChatActionProps = TdChatActionProps;
export type ChatInputProps = TdChatInputProps;
export type ChatSenderProps = TdChatSenderProps;
export type ChatReasoningProps = TdChatReasoningProps;
export type ChatLoadingProps = TdChatLoadingProps;

export const Chat = withInstall(_Chat);
export const ChatItem = withInstall(_ChatItem);
export const ChatInput = withInstall(_ChatInput);
export const ChatSender = withInstall(_ChatSender);
export const ChatContent = withInstall(_ChatContent);
export const ChatReasoning = withInstall(_ChatReasoning);
export const ChatAction = withInstall(_ChatAction);
export const ChatLoading = withInstall(_ChatLoading);
export const ChatMessage = withInstall(_ChatMessage, 't-chat-message');
export const ChatMarkdown = withInstall(_ChatMarkdown, 't-chat-markdown');
export const Chatbot = withInstall(_Chatbot, 't-chatbot');
export const Attachments = withInstall(_Attachments, 't-attachments');
export const ChatThinking = withInstall(_ChatThinking, 't-chat-thinking');
export const ChatSearchContent = withInstall(_ChatSearchContent, 't-chat-search-content');
export const ChatSuggestionContent = withInstall(_ChatSuggestionContent, 't-chat-suggestion-content');
export const ToolCallRenderer = withInstall(_ToolCallRenderer, 't-toolcall-renderer');

// 兼容 pro-components 的命名
export const ChatList = Chat;
export const ChatActionbar = ChatAction;

// 导出工具函数
export {
  isAIMessage,
  isToolCallContent,
  getMessageContentForCopy,
} from './types';

export const version = '1.0.0';

export default {
  install(Vue: typeof import('vue'), config?: Record<string, unknown>) {
    Vue.use(Chat as any, config);
    Vue.use(ChatItem as any, config);
    Vue.use(ChatInput as any, config);
    Vue.use(ChatContent as any, config);
    Vue.use(ChatReasoning as any, config);
    Vue.use(ChatAction as any, config);
    Vue.use(ChatLoading as any, config);
    Vue.use(ChatSender as any, config);
    Vue.use(ChatMessage as any, config);
    Vue.use(ChatMarkdown as any, config);
    Vue.use(Chatbot as any, config);
    Vue.use(Attachments as any, config);
    Vue.use(ChatThinking as any, config);
    Vue.use(ChatSearchContent as any, config);
    Vue.use(ChatSuggestionContent as any, config);
    Vue.use(ToolCallRenderer as any, config);
  },
  version,
};

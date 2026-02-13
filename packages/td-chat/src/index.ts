import _Chat from './components/chat.vue';
import _ChatItem from './components/chat-item.vue';
import _ChatInput from './components/chat-input.vue';
import _ChatContent from './components/chat-content.vue';
import _ChatReasoning from './components/chat-reasoning.vue';
import _ChatLoading from './components/chat-loading.vue';
import _ChatAction from './components/chat-action.vue';
import _ChatSender from './components/chat-sender.vue';

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
} from './types';

import './style';

export * from './types';
export * from './utils';
export * from './utils/adapter';
export * from './composables/useChat';

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
  },
  version,
};

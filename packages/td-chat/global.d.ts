declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@jump-mp/td-chat' {
  import { App, Plugin } from 'vue';

  export const Chat: any;
  export const ChatItem: any;
  export const ChatInput: any;
  export const ChatSender: any;
  export const ChatContent: any;
  export const ChatReasoning: any;
  export const ChatAction: any;
  export const ChatLoading: any;

  const TDesignChat: Plugin;
  export default TDesignChat;
}

declare const PKG_VERSION: string;

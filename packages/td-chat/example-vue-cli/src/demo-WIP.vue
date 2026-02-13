<template>
  <div style="margin-top: -18px; height: 408px; display: flex; flex-direction: column">
    <t-chat
      ref="listRef"
      :clear-history="false"
      layout="both"
      :data="messages"
      v-bind="messageProps.assistant"
    >
      <!-- Chat Message Customization via Scoped Slots -->
      <!-- In Vue 2.7, t-chat iterates over data. We need to check how t-chat renders items. 
           If t-chat uses a loop internally and provides slots for content, we use them here.
           However, the Vue 3 demo uses <t-chat-list> and <t-chat-message> explicitly.
           Our Vue 2 implementation of TChat might be a wrapper around List + Message or just a monolithic component.
           Checking TChat implementation... it seems to be monolithic in Vue 2 port based on previous context.
           Wait, I ported "all components". Let's check if TChatList and TChatMessage are available.
           If they are available as named exports from the package, I should use them to match Vue 3 structure.
           The package index.ts exports Chat, ChatItem, etc. 
           So <t-chat> corresponds to Chat. <t-chat-item> corresponds to ChatItem.
           The Vue 3 demo uses <t-chat-list> and <t-chat-message>.
           Let's assume ChatList -> TChat (wrapper) or we need to use TChatList if exported.
           Actually, in Vue 3 `t-chat` is often the high level, but `t-chat-list` is lower level.
           Let's stick to what we exported: Chat, ChatItem, ChatInput, etc.
           I will try to mimic the Vue 3 structure using the components I exported.
      -->
      
      <!-- RE-PLAN for Template: 
           The Vue 3 demo uses explicit composition:
           <t-chat-list>
             <t-chat-message v-for...>
           </t-chat-list>
           
           If my Vue 2 package exports `Chat` as the main component, I might need to see if it supports default slot for messages.
           If `Chat` is just `TChat`, and `TChat` in Vue 3 is the high level one.
           The Vue 3 demo uses `t-chat-list` (TChatList).
           Did I export `ChatList`? I exported `Chat` which corresponds to `_Chat`.
           Let's check `packages/td-chat/src/components/chat.vue`.
           If `chat.vue` iterates over `data`, then I should use `data` prop.
           But the Vue 3 demo manually iterates `<t-chat-message>`.
           
           If I want exact sync, I should use the same composition.
           Does `td-chat` (Vue 2) export `ChatList`?
           Looking at `src/index.ts` I wrote earlier:
           `export const Chat = withInstall(_Chat);`
           `export const ChatItem = withInstall(_ChatItem);`
           
           I did NOT export `ChatList`. I exported `Chat`.
           Let's check if `Chat` in Vue 2 is actually `ChatList` + `ChatInput` or just `ChatList`.
           Usually `TChat` = `ChatList` + `ChatInput` + Layout.
           
           The Vue 3 demo uses:
           <t-chat-list> ... </t-chat-list>
           <t-chat-sender> ... </t-chat-sender>
           
           This suggests `t-chat-list` is a container for messages.
           In my Vue 2 port, `Chat` likely corresponds to the whole thing if passed `data`, OR it might be usable as a list container?
           
           Let's check `packages/td-chat/src/components/chat.vue` content from previous turn (or I can read it).
           If `Chat` component has a slot, I can use it.
           
           For now, I will assume `t-chat` in Vue 2 can behave like `t-chat-list` if I don't pass `data` and just put content in slot?
           Or maybe I should use `t-chat` with `data` prop as the primary way, but the demo wants manual control.
           
           WAIT. The User Requirement is "exact sync".
           If Vue 3 demo uses `<t-chat-list>`, I should probably use `<t-chat>` (which seems to be the list in Vue 2 port context? Or is `Chat` the wrapper?)
           
           Let's read `packages/td-chat/src/components/chat.vue` to understand what `Chat` does.
      -->
    </t-chat>
  </div>
</template>

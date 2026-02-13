# Comparison Matrix: pro-components/chat (Vue 3) vs td-chat (Vue 2.7)

| Component | Feature | pro-components (Vue 3) | td-chat (Vue 2.7) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Infrastructure** | Build System | Vite/Rollup | Rollup (Vue 2 Plugin) | ✅ | |
| | Types | TypeScript | TypeScript | ✅ | |
| | Styles | CSS/Less | Less (Common Style) | ✅ | Imported from @tdesign/common-style |
| **Composables** | useVModel | Native | Custom Hook | ✅ | Handles value/modelValue bridging |
| | useTNodeJSX | Native JSX | Custom Hook + TNode | ✅ | Renders function/slot/VNode |
| **Chat** | Props | All | All | ✅ | |
| | Events | clear, scroll | clear, scroll | ✅ | |
| | Slots | All | All | ✅ | Via TNode |
| | Methods | scrollToBottom | scrollToBottom | ✅ | Exposed via return in setup |
| **ChatItem** | Props | All | All | ✅ | |
| | Events | - | - | ✅ | |
| | Slots | avatar, name, content, etc. | avatar, name, content, etc. | ✅ | |
| **ChatInput** | Props | All | All | ✅ | |
| | Events | send, stop, focus, blur | send, stop, focus, blur | ✅ | |
| | Slots | suffixIcon | suffixIcon | ✅ | |
| **ChatContent** | Props | content, role | content, role | ✅ | |
| | Rendering | Markdown/HTML | Markdown/HTML | ✅ | Uses marked/highlight.js |
| **ChatAction** | Props | operationBtn, etc. | operationBtn, etc. | ✅ | |
| | Events | operation | operation | ✅ | |
| **ChatSender** | Props | loading, disabled, etc. | loading, disabled, etc. | ✅ | |
| | Events | send, stop, fileSelect | send, stop, fileSelect | ✅ | |
| | Slots | prefix, suffix, header | prefix, suffix, header | ✅ | |
| **ChatLoading** | Props | animation, text | animation, text | ✅ | |
| **ChatReasoning** | Props | collapsePanelProps, etc. | collapsePanelProps, etc. | ✅ | |
| | Events | expand-change | expand-change | ✅ | |

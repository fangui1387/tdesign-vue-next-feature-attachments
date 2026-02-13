# @jump-mp/td-chat

TDesign Chat Component for Vue 2.7. Based on TDesign Vue Next Chat.

## Installation

```bash
npm install @jump-mp/td-chat tdesign-vue tdesign-icons-vue
```

## Usage

### Global Registration

```javascript
import Vue from 'vue';
import TDesignChat from '@jump-mp/td-chat';
// Import TDesign Vue styles
import 'tdesign-vue/es/style/index.css';
// Import Chat specific styles (Required)
import 'tdesign-vue/esm/_common/style/web/components/chat/_index.less';

Vue.use(TDesignChat);
```

### Local Registration

```javascript
import { Chat, ChatItem, ChatInput } from '@jump-mp/td-chat';
import 'tdesign-vue/es/style/index.css';
import 'tdesign-vue/esm/_common/style/web/components/chat/_index.less';

export default {
  components: {
    TChat: Chat,
    TChatItem: ChatItem,
    TChatInput: ChatInput,
  },
};
```

## Vue 2 Compatibility

This package is designed for Vue 2.7.16+.

- **Composition API**: Fully supported via Vue 2.7 built-in Composition API.
- **v-model**: Components support both `v-model` (Vue 2 `value`/`input`) and `v-model:modelValue` (Vue 3 style, if using `unplugin-vue2-script-setup` or similar, but standard `v-model` is recommended).
- **Slots**: Uses standard Vue 2 scoped slots.

## API

### Chat Props

| Name | Type | Default | Description | Required |
| -- | -- | -- | -- | -- |
| actions | Slot / Function | - | Custom action buttons slot. TS Type: `TNode` | N |
| animation | String | skeleton | Animation effect. Options: skeleton/moving/gradient | N |
| avatar | Slot / Function | - | Custom avatar slot per item. TS Type: `TNode<{ item: TdChatItemProps, index: number }>` | N |
| clearHistory | Boolean | true | Whether to show clear history button | N |
| content | Slot / Function | - | Custom content slot per item. TS Type: `TNode<{ item: TdChatItemProps, index: number }>` | N |
| data | Array | - | Chat list data. TS Type: `Array<TdChatItemMeta>` | N |
| datetime | Slot / Function | - | Custom datetime slot per item. TS Type: `TNode<{ item: TdChatItemProps, index: number }>` | N |
| isStreamLoad | Boolean | false | Whether stream loading is finished | N |
| layout | String | both | Layout type. Options: both/single | N |
| name | Slot / Function | - | Custom name slot per item. TS Type: `TNode<{ item: TdChatItemProps, index: number }>` | N |
| reasoning | Slot / Function | - | Custom reasoning slot per item. TS Type: `TNode<{ item: TdChatItemProps, index: number }>` | N |
| reverse | Boolean | true | Whether to reverse the list | N |
| textLoading | Boolean | false | Whether new message is loading | N |
| onClear | Function |  | Click clear history callback. TS Type: `(context: { e: MouseEvent }) => void` | N |
| onScroll | Function |  | Scroll callback. TS Type: `(context: { e: MouseEvent }) => void` | N |

### Chat Events

| Name | Parameters | Description |
| -- | -- | -- |
| clear | `(context: { e: MouseEvent })` | Click clear history callback |
| scroll | `(context: { e: MouseEvent })` | Scroll callback |

### Chat Instance Methods

| Name | Parameters | Description |
| -- | -- | -- |
| scrollToBottom | `(params: { behavior: 'auto' \| 'smooth' })` | Scroll to bottom |

### ChatItem Props

| Name | Type | Default | Description | Required |
| -- | -- | -- | -- | -- |
| actions | String / Slot / Function | - | Custom actions content. TS Type: `string \| TNode` | N |
| animation | String | skeleton | Animation effect. Options: skeleton/moving/gradient | N |
| avatar | String / Object / Slot / Function | - | Custom avatar configuration. TS Type: `String \| AvatarProps \| TNode` | N |
| content | String / Slot / Function | - | Chat content. TS Type: `string \| TNode` | N |
| datetime | String / Slot / Function | - | Datetime configuration. TS Type: `string \| TNode` | N |
| name | String / Slot / Function | - | Custom nickname. TS Type: `string \| TNode` | N |
| reasoning | String / Boolean / Object | false | Reasoning content configuration. TS Type: `boolean \| TdChatReasoning` | N |
| role | String | - | Role options: user/assistant/error/model-change/system | N |
| textLoading | Boolean | false | Whether message is loading | N |
| variant | String | text | Bubble style. Options: base/outline/text | N |

### ChatInput Props

| Name | Type | Default | Description | Required |
| -- | -- | -- | -- | -- |
| autofocus | Boolean | false | Whether to autofocus | N |
| autosize | Boolean / Object | `{ minRows: 1, maxRows: 5 }` | Auto height configuration | N |
| disabled | Boolean | false | Whether to disable input | N |
| placeholder | String | - | Placeholder text | N |
| stopDisabled | Boolean | false | Whether stop button is disabled | N |
| suffixIcon | Slot / Function | - | Custom suffix icon. TS Type: `TNode` | N |
| value | String | - | Input value. Supports `v-model` | N |
| defaultValue | String | - | Default value (uncontrolled) | N |
| onBlur | Function |  | Blur callback | N |
| onChange | Function |  | Change callback | N |
| onFocus | Function |  | Focus callback | N |
| onSend | Function |  | Send callback | N |
| onStop | Function |  | Stop callback | N |

### ChatInput Events

| Name | Parameters | Description |
| -- | -- | -- |
| blur | `(value:string, context: { e: FocusEvent })` | Blur event |
| change | `(value:string, context: { e: InputEvent \| MouseEvent \| KeyboardEvent })` | Change event |
| focus | `(value:string, context: { e: FocusEvent })` | Focus event |
| send | `(value:string, context: { e: MouseEvent \| KeyboardEvent })` | Send event |
| stop | `(value:string, context: { e: MouseEvent })` | Stop event |

### ChatSender Props

| Name | Type | Default | Description | Required |
| -- | -- | -- | -- | -- |
| disabled | Boolean | false | Whether to disable input | N |
| placeholder | String | - | Placeholder text | N |
| prefix | String / Slot / Function | - | Prefix content | N |
| loading | Boolean | false | Whether send button is loading | N |
| suffix | String / Slot / Function | - | Suffix content | N |
| header | String / Slot / Function | - | Outer header content | N |
| inner-header | String / Slot / Function | - | Inner header content | N |
| textareaProps | Object | - | Props passed to Textarea component | N |
| value | String | - | Input value. Supports `v-model` | N |
| defaultValue | String | - | Default value | N |
| onBlur | Function |  | Blur callback | N |
| onChange | Function |  | Change callback | N |
| onFocus | Function |  | Focus callback | N |
| onSend | Function |  | Send callback | N |
| onStop | Function |  | Stop callback | N |
| onFileSelect | Function |  | File select callback | N |

### ChatSender Events

| Name | Parameters | Description |
| -- | -- | -- |
| blur | `(value:string, context: { e: FocusEvent })` | Blur event |
| change | `(value:string, context: { e: InputEvent \| MouseEvent \| KeyboardEvent })` | Change event |
| focus | `(value:string, context: { e: FocusEvent })` | Focus event |
| send | `(value:string, context: { e: MouseEvent \| KeyboardEvent })` | Send event |
| stop | `(value:string, context: { e: MouseEvent })` | Stop event |
| fileSelect | `({files: FileList, name: UploadActionType})` | File select event |

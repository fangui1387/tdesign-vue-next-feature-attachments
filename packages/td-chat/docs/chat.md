# Chat 聊天组件

聊天组件容器，用于展示对话列表。

## API

### Chat Props

| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| actions | Slot / Function | - | 自定义操作按钮的插槽。TS 类型：`TNode` | N |
| animation | String | skeleton | 动画效果，支持「渐变加载动画」,「闪烁加载动画」, 「骨架屏」三种。可选项：skeleton/moving/gradient | N |
| avatar | Slot / Function | - | 自定义每个对话单元的头像插槽。TS 类型：`TNode<{ item: TdChatItemProps, index: number }>` | N |
| clearHistory | Boolean | true | 是否显示清空历史 | N |
| content | Slot / Function | - | 自定义每个对话单独的聊天内容。TS 类型：`TNode<{ item: TdChatItemProps, index: number }>` | N |
| data | Array | - | 对话列表的数据。TS 类型：`Array<TdChatItemMeta>` | N |
| datetime | Slot / Function | - | 自定义每个对话单元的时间。TS 类型：`TNode<{ item: TdChatItemProps, index: number }>` | N |
| isStreamLoad | Boolean | false | 流式加载是否结束 | N |
| layout | String | both | 对话布局形式，支持两侧对齐与左对齐。可选项：both/single | N |
| name | Slot / Function | - | 自定义每个对话单元的昵称。TS 类型：`TNode<{ item: TdChatItemProps, index: number }>` | N |
| reasoning | Slot / Function | - | 自定义每个对话单元的思考过程的插槽。TS 类型：`TNode<{ item: TdChatItemProps, index: number }>` | N |
| reverse | Boolean | true | 是否表现为倒序 | N |
| textLoading | Boolean | false | 新消息是否处于加载状态，加载状态默认显示骨架屏，接口请求返回数据时请将新消息加载状态置为false | N |
| onClear | Function | - | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击清空历史按钮回调 | N |
| onScroll | Function | - | TS 类型：`(context: { e: MouseEvent }) => void`<br/>滚动事件的回调 | N |

### Chat Events

| 名称 | 参数 | 描述 |
|------|------|------|
| clear | `(context: { e: MouseEvent })` | 点击清空历史按钮回调 |
| scroll | `(context: { e: MouseEvent })` | 滚动事件的回调 |

### ChatInstanceFunctions 组件实例方法

| 名称 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| scrollToBottom | `(params: ScrollToBottomParams)` | - | 对话列表过长时，支持对话列表重新滚动回底部的方法。`type ScrollToBottomParams = { behavior: 'auto' \| 'smooth'}` |

### Chat Slots

| 名称 | 参数 | 描述 |
|------|------|------|
| default | - | 默认插槽，用于自定义对话列表内容 |
| actions | `{ item, index }` | 自定义操作按钮 |
| avatar | `{ item, index }` | 自定义头像 |
| content | `{ item, index }` | 自定义内容 |
| datetime | `{ item, index }` | 自定义时间 |
| name | `{ item, index }` | 自定义昵称 |
| clearHistory | - | 自定义清空历史按钮 |
| footer | - | 底部插槽 |

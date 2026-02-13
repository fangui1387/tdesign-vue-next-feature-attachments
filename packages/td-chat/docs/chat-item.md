# ChatItem 聊天项组件

聊天项组件，用于展示单个对话单元。

## API

### ChatItem Props

| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| actions | String / Slot / Function | - | 自定义的操作内容。TS 类型：`string \| TNode` | N |
| animation | String | skeleton | 动画效果，支持「渐变加载动画」,「闪烁加载动画」, 「骨架屏」三种。可选项：skeleton/moving/gradient | N |
| avatar | String / Object / Slot / Function | - | 自定义的头像配置。TS 类型：`String \| AvatarProps \| TNode` | N |
| content | String / Slot / Function | - | 对话单元的内容。TS 类型：`string \| TNode` | N |
| datetime | String / Slot / Function | - | 对话单元的时间配置。TS 类型：`string \| TNode` | N |
| name | String / Slot / Function | - | 自定义的昵称。TS 类型：`string \| TNode` | N |
| reasoning | String / Boolean / Object | false | 值为false不显示思维链，为string则显示内置推理内容交互，为对象则单独配置推理内容。TS 类型：`boolean \| TdChatReasoning` | N |
| role | String | - | 角色，不同选项配置不同的样式，支持类型包括用户、助手、错误、模型切换、系统消息。可选项：user/assistant/error/model-change/system | N |
| textLoading | Boolean | false | 新消息是否处于加载状态，加载状态默认显示骨架屏，接口请求返回数据时请将新消息加载状态置为false | N |
| variant | String | text | 气泡框样式，支持基础、线框、文字三种类型。可选项：base/outline/text | N |

### ChatItem Slots

| 名称 | 参数 | 描述 |
|------|------|------|
| actions | - | 自定义操作内容 |
| avatar | - | 自定义头像 |
| content | - | 自定义内容 |
| datetime | - | 自定义时间 |
| name | - | 自定义昵称 |

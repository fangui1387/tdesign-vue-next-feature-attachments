# ChatContent 内容组件

聊天内容渲染组件，支持 Markdown 格式。

## API

### ChatContent Props

| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| content | String | '' | 聊天内容，支持 markdown 格式 | N |
| role | String | - | 角色，不同选项配置不同的样式，支持类型包括用户、助手、错误、模型切换、系统消息。可选项：user/assistant/error/model-change/system | N |

### ChatContent 说明

ChatContent 组件会自动根据 role 处理内容的渲染方式：
- `user` 角色：内容会以纯文本形式展示，并进行 HTML 转义
- `assistant` 角色：内容会以 Markdown 格式渲染，支持代码高亮
- `model-change` 角色：内容直接展示，支持 HTML 标签

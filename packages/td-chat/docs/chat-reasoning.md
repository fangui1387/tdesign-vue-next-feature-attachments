# ChatReasoning 推理组件

推理内容展示组件，用于展示 AI 的思考过程。

## API

### ChatReasoning Props

| 名称 | 类型 | 默认值 | 描述 | 必传 |
|------|------|--------|------|------|
| collapsePanelProps | Object | { destroyOnCollapse: false } | 透传给 CollapsePanel 组件的全部属性 | N |
| expandIcon | Slot / Function | - | 当前折叠面板展开图标。优先级低于collapsePanelProps.expandIcon | N |
| expandIconPlacement | String | right | 展开图标位置，可选项：left/right | N |
| header | Slot / Function | - | 折叠面板头内容。优先级低于collapsePanelProps.header | N |
| headerRightContent | Slot / Function | - | 折叠面板尾内容。优先级低于collapsePanelProps.headerRightContent | N |
| onExpandChange | Function | - | 展开图标点击事件。TS 类型：`(value: boolean) => void` | N |
| collapsed | Boolean | false | 是否折叠 | N |
| modelValue | Boolean | - | 是否折叠。支持语法糖 `v-model` | N |
| defaultCollapsed | Boolean | false | 是否折叠。非受控属性 | N |

### ChatReasoning Events

| 名称 | 参数 | 描述 |
|------|------|------|
| expand-change | `(value: boolean)` | 展开状态变化时触发 |
| update:collapsed | `(value: boolean)` | 展开状态变化时触发（v-model） |

### ChatReasoning Slots

| 名称 | 参数 | 描述 |
|------|------|------|
| default | - | 折叠面板内容 |
| header | - | 折叠面板头部 |
| headerRightContent | - | 折叠面板头部右侧内容 |
| expandIcon | - | 展开图标 |

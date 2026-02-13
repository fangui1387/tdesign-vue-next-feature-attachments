## 项目背景与目标

将 `/packages/td-chat` 重构为基于 `/packages/pro-components/chat` 的 Vue 2.7.16 版本，确保功能完全一致。

---

## 一、现状分析

### 1.1 架构差异对比

| 维度 | pro-components/chat (Vue 3) | td-chat (Vue 2.7) | 差异分析 |
|------|---------------------------|------------------|---------|
| **组件模型** | JSX + Composition API | Template + Options API | 需要统一为 Options API 或 Vue 2.7 Composition API |
| **类型系统** | 完整 TypeScript 类型 | 部分类型定义 | 需要补全类型 |
| **组件数量** | 18个组件 | 8个基础组件 | 需要新增 10 个组件 |
| **Chat Engine** | 完整的 tdesign-web-components 集成 | 简单的 useChat composable | 需要重构为完整引擎 |
| **样式系统** | tdesign-web-components 样式 | 依赖 tdesign-vue 样式 | 需要统一样式来源 |

### 1.2 组件映射关系

```
pro-components/chat          td-chat (现有)         状态
├── chat-list.tsx            ├── chat.vue           ⚠️ 需重构
├── chat-item.tsx            ├── chat-item.vue      ⚠️ 需重构
├── chat-content.tsx         ├── chat-content.vue   ⚠️ 需重构
├── chat-input.tsx           ├── chat-input.vue     ⚠️ 需重构
├── chat-sender.tsx          ├── chat-sender.vue    ⚠️ 需重构
├── chat-reasoning.tsx       ├── chat-reasoning.vue ⚠️ 需重构
├── chat-loading.tsx         ├── chat-loading.vue   ⚠️ 需重构
├── chat-actionbar.tsx       ├── chat-action.vue    ⚠️ 需重构
├── chat-message.tsx         ❌ 缺失               🔴 需新增
├── chat-markdown.tsx        ❌ 缺失               🔴 需新增
├── chat-thinking.tsx        ❌ 缺失               🔴 需新增
├── chat-engine/             ❌ 缺失               🔴 需新增
├── chatbot/                 ❌ 缺失               🔴 需新增
├── attachments/             ❌ 缺失               🔴 需新增
└── ...                      ❌ 更多缺失            🔴 需新增
```

### 1.3 核心差异点

1. **API 不一致**：pro-components 使用 `actionbar`，td-chat 使用 `actions`
2. **类型定义不完整**：td-chat 缺少 `TdChatMessageConfig`、`ChatRequestParams` 等类型
3. **缺少高级组件**：ChatEngine、Chatbot、Attachments 等核心功能缺失
4. **样式系统不统一**：pro-components 使用 web-components 样式，td-chat 依赖 tdesign-vue

---

## 二、重构方案

### 2.1 架构重构策略

#### 阶段一：类型系统对齐（高优先级）
- 完全复制 `pro-components/chat/type.ts` 到 `td-chat/src/types/index.ts`
- 适配 Vue 2.7 的类型定义（TNode、组件 props 等）
- 确保类型导出与 pro-components 完全一致

#### 阶段二：基础组件重构（高优先级）
将现有 8 个组件从 Options API 重构为与 pro-components 一致的实现：

1. **chat.vue** → 对齐 chat-list.tsx 功能
   - 添加 `autoScroll`、`defaultScrollTo`、`showScrollButton` 属性
   - 实现 `scrollToBottom` 实例方法
   - 添加 ResizeObserver 自动滚动逻辑

2. **chat-item.vue** → 对齐 chat-item.tsx
   - 添加 `actionbar` 属性（兼容 `actions`）
   - 添加 `status` 属性支持
   - 完善 reasoning 对象类型支持

3. **chat-content.vue** → 对齐 chat-content.tsx
   - 添加 markdown 引擎支持
   - 添加代码高亮功能

4. **chat-sender.vue** → 对齐 chat-sender.tsx
   - 属性名对齐：`prefix` → `footerPrefix`
   - 添加 `textareaProps` 透传支持
   - 添加 `attachmentsProps` 支持

5. **chat-action.vue** → 对齐 chat-actionbar.tsx
   - 属性名对齐：`operationBtn` → `actionBar`
   - 添加 `onActions` 事件
   - 添加 `comment` 属性替代 `isGood/isBad`

6. **chat-input.vue**、**chat-reasoning.vue**、**chat-loading.vue** → 同步更新

#### 阶段三：新增高级组件（高优先级）

1. **chat-message** - 消息渲染组件
   - 整合 chat-item + chat-content
   - 支持 placement 布局
   - 支持多种消息类型

2. **chat-markdown** - Markdown 渲染组件
   - 基于 marked + highlight.js
   - 支持代码块高亮
   - 支持自定义渲染

3. **chat-thinking** - 思考过程组件
   - 流式显示思考内容
   - 支持动画效果

4. **attachments** - 附件组件
   - 文件上传展示
   - 支持滚动布局

5. **chat-engine** - 聊天引擎
   - useChat 重构
   - useAgentToolcall
   - useAgentState
   - ToolCallRenderer

6. **chatbot** - 完整聊天机器人组件
   - 整合所有子组件
   - 提供完整聊天界面

#### 阶段四：样式系统统一（中优先级）
- 引入 tdesign-web-components 样式
- 统一 CSS 变量命名
- 确保与 pro-components 视觉一致

#### 阶段五：构建配置优化（中优先级）
- 更新 rollup.config.js 支持新组件
- 优化 external 依赖
- 确保 TypeScript 声明文件正确生成

---

### 2.2 Vue 2.7.16 适配策略

由于 Vue 2.7 支持 Composition API，但实现方式与 Vue 3 有差异：

```typescript
// Vue 3 写法
defineComponent({
  setup(props, { emit }) {
    const count = ref(0);
    return { count };
  }
});

// Vue 2.7 兼容写法
Vue.extend({
  setup(props, { emit }) {
    const count = ref(0);
    return { count };
  }
});
```

或者继续使用 Options API 保持与现有代码一致。

---

### 2.3 依赖调整

```json
{
  "peerDependencies": {
    "tdesign-vue": "^1.0.0",
    "vue": "^2.7.0"
  },
  "dependencies": {
    "clipboard": "^2.0.11",
    "lodash-es": "^4.17.21",
    "marked": "^12.0.0",
    "marked-highlight": "^2.1.0",
    "highlight.js": "^11.9.0"
  }
}
```

---

## 三、实施计划

### 阶段一：类型系统（预计 1 天）
- [ ] 复制并适配 type.ts
- [ ] 更新 index.ts 导出
- [ ] 验证类型完整性

### 阶段二：基础组件重构（预计 3 天）
- [ ] 重构 chat.vue
- [ ] 重构 chat-item.vue
- [ ] 重构 chat-content.vue
- [ ] 重构 chat-sender.vue
- [ ] 重构 chat-action.vue
- [ ] 重构 chat-input.vue
- [ ] 重构 chat-reasoning.vue
- [ ] 重构 chat-loading.vue

### 阶段三：新增组件（预计 4 天）
- [ ] 实现 chat-message
- [ ] 实现 chat-markdown
- [ ] 实现 chat-thinking
- [ ] 实现 attachments
- [ ] 实现 chat-engine 核心
- [ ] 实现 chatbot

### 阶段四：样式与构建（预计 2 天）
- [ ] 统一样式系统
- [ ] 更新构建配置
- [ ] 验证打包输出

### 阶段五：测试验证（预计 2 天）
- [ ] 单元测试
- [ ] 功能对比测试
- [ ] Vue 2 工程集成测试

---

## 四、风险与应对

| 风险 | 影响 | 应对措施 |
|-----|------|---------|
| Vue 2.7 Composition API 兼容性问题 | 高 | 使用 Options API 作为备选方案 |
| tdesign-web-components 样式冲突 | 中 | 创建样式隔离层 |
| 构建体积增大 | 中 | 优化 tree-shaking 配置 |
| 功能回归 | 高 | 建立完整测试用例 |

---

## 五、验收标准

1. ✅ 所有组件 API 与 pro-components/chat 完全一致
2. ✅ TypeScript 类型定义完整
3. ✅ Vue 2.7 工程可以正常编译运行
4. ✅ 单元测试通过率 100%
5. ✅ 视觉表现与 pro-components 一致
6. ✅ 打包输出格式正确（ES/CJS/UMD）

请确认此计划后，我将开始实施重构工作。
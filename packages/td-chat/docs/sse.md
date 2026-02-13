---
title: SSE 流式输出
description: 使用 SSE 流式输出实现 AI 对话效果
spline: ai
---

## SSE 流式输出

SSE（Server-Sent Events）是一种服务器向浏览器推送实时数据的技术。在 AI 对话场景中，SSE 常用于实现流式输出效果，让用户可以实时看到 AI 的回复内容。

## 基本原理

1. 客户端通过 EventSource 或 fetch API 建立与服务器的连接
2. 服务器以流的形式逐步返回数据
3. 客户端实时接收并展示数据

## 使用示例

### 基础 SSE 请求

```vue
<template>
  <t-chat :data="chatList">
    <template #footer>
      <t-chat-sender
        v-model="inputValue"
        :loading="isStreamLoad"
        @send="handleSend"
        @stop="handleStop"
      />
    </template>
  </t-chat>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      isStreamLoad: false,
      chatList: [],
    };
  },
  methods: {
    async handleSend(value) {
      // 添加用户消息
      this.chatList.unshift({
        content: value,
        role: 'user',
      });
      
      // 添加 AI 消息占位
      this.chatList.unshift({
        content: '',
        role: 'assistant',
      });
      
      this.isStreamLoad = true;
      const lastItem = this.chatList[0];
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: value }),
        });
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                lastItem.content += data.delta.content || '';
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('SSE error:', error);
        lastItem.role = 'error';
        lastItem.content = '请求失败';
      } finally {
        this.isStreamLoad = false;
      }
    },
    handleStop() {
      // 中止请求
      this.isStreamLoad = false;
    },
  },
};
</script>
```

### 带推理内容的 SSE

```vue
<template>
  <t-chat :data="chatList">
    <template #content="{ item, index }">
      <t-chat-reasoning
        v-if="item.reasoning"
        expand-icon-placement="right"
      >
        <template #header>
          <t-chat-loading v-if="isStreamLoad && !item.content" text="思考中..." />
          <span v-else>已深度思考</span>
        </template>
        <t-chat-content :content="item.reasoning" />
      </t-chat-reasoning>
      <t-chat-content :content="item.content" />
    </template>
    <template #footer>
      <t-chat-sender
        v-model="inputValue"
        :loading="isStreamLoad"
        @send="handleSend"
      />
    </template>
  </t-chat>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      isStreamLoad: false,
      chatList: [],
    };
  },
  methods: {
    async handleSend(value) {
      this.chatList.unshift({
        content: value,
        role: 'user',
      });
      
      this.chatList.unshift({
        content: '',
        reasoning: '',
        role: 'assistant',
      });
      
      this.isStreamLoad = true;
      const lastItem = this.chatList[0];
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: value }),
      });
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            const data = JSON.parse(line);
            // 推理内容
            if (data.delta.reasoning_content) {
              lastItem.reasoning += data.delta.reasoning_content;
            }
            // 正式回复内容
            if (data.delta.content) {
              lastItem.content += data.delta.content;
            }
          }
        }
      }
      
      this.isStreamLoad = false;
    },
  },
};
</script>
```

## Mock 数据

在开发阶段，可以使用 Mock 数据模拟 SSE 流式输出：

```typescript
// mock-data/sseRequest.ts
export class MockSSEResponse {
  constructor(private data: string) {}

  getResponse() {
    const stream = new ReadableStream({
      start(controller) {
        const chunks = this.data.split('');
        let index = 0;
        
        const sendChunk = () => {
          if (index >= chunks.length) {
            controller.close();
            return;
          }
          
          const encoder = new TextEncoder();
          const data = { delta: { content: chunks[index] } };
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
          
          index++;
          setTimeout(sendChunk, 50);
        };
        
        sendChunk();
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
```

## 注意事项

1. **错误处理**：SSE 连接可能会中断，需要做好错误处理和重连机制
2. **中止请求**：用户可能需要中止正在进行的请求，使用 AbortController 或手动关闭连接
3. **数据解析**：SSE 数据格式可能因后端实现而异，需要根据实际情况调整解析逻辑
4. **性能优化**：大量流式数据更新时，注意避免频繁的 DOM 更新导致性能问题

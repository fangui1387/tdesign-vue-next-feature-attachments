/**
 * SSE 请求模拟
 * 用于模拟流式数据返回
 */

export class MockSSEResponse {
  private controller: ReadableStreamController<Uint8Array>;
  public controllerRef: ReadableStreamController<Uint8Array>;
  
  constructor(private data: { content?: string; reasoning?: string }) {
    this.controller = null as any;
    this.controllerRef = null as any;
  }

  getResponse() {
    const self = this;
    
    const stream = new ReadableStream({
      start(controller) {
        self.controller = controller;
        self.controllerRef = controller;
        
        // 模拟流式数据返回
        const content = self.data.content || '';
        const reasoning = self.data.reasoning || '';
        
        // 将内容分成小块发送
        const contentChunks = content.split('');
        const reasoningChunks = reasoning.split('');
        
        let index = 0;
        const maxLength = Math.max(contentChunks.length, reasoningChunks.length);
        
        const sendChunk = () => {
          if (index >= maxLength) {
            controller.close();
            return;
          }
          
          const delta: any = {};
          if (index < contentChunks.length) {
            delta.content = contentChunks[index];
          }
          if (index < reasoningChunks.length) {
            delta.reasoning_content = reasoningChunks[index];
          }
          
          const data = {
            delta,
          };
          
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
          
          index++;
          setTimeout(sendChunk, 50); // 每50ms发送一个字符
        };
        
        sendChunk();
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
  
  close() {
    if (this.controller) {
      this.controller.close();
    }
  }
}

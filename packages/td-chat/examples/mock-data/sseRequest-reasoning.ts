/**
 * SSE 请求模拟（带推理内容）
 * 用于模拟带推理过程的流式数据返回
 */

export class MockSSEResponse {
  public controller: { close: () => void };
  
  constructor(private data: { content?: string; reasoning?: string }) {
    this.controller = { close: () => {} };
  }

  getResponse() {
    const self = this;
    let closed = false;
    
    const stream = new ReadableStream({
      start(controller) {
        self.controller = {
          close: () => {
            if (!closed) {
              closed = true;
              controller.close();
            }
          }
        };
        
        // 模拟流式数据返回
        const content = self.data.content || '';
        const reasoning = self.data.reasoning || '';
        
        // 先发送推理内容
        const reasoningChunks = reasoning.split(/(?=[。，！？\n])|(?<=[。，！？\n])/);
        const contentChunks = content.split(/(?=[。，！？\n])|(?<=[。，！？\n])/);
        
        let reasoningIndex = 0;
        let contentIndex = 0;
        let phase: 'reasoning' | 'content' | 'done' = 'reasoning';
        
        const sendChunk = () => {
          if (closed) return;
          
          if (phase === 'reasoning') {
            if (reasoningIndex < reasoningChunks.length) {
              const delta = {
                reasoning_content: reasoningChunks[reasoningIndex],
                content: '',
              };
              
              const data = { delta };
              const encoder = new TextEncoder();
              controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
              
              reasoningIndex++;
              setTimeout(sendChunk, 100);
            } else {
              phase = 'content';
              setTimeout(sendChunk, 200);
            }
          } else if (phase === 'content') {
            if (contentIndex < contentChunks.length) {
              const delta = {
                reasoning_content: '',
                content: contentChunks[contentIndex],
              };
              
              const data = { delta };
              const encoder = new TextEncoder();
              controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
              
              contentIndex++;
              setTimeout(sendChunk, 100);
            } else {
              phase = 'done';
              controller.close();
            }
          }
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
}

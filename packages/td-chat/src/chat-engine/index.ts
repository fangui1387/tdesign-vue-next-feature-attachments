import Vue from 'vue';
import {
  ChatRequestParams,
  ChatMessagesData,
  ChatServiceConfig,
  SSEChunkData,
  ToolCall,
  ToolCallContent,
  ToolCallResult,
} from '../types';

export interface ChatEngineOptions {
  chatServiceConfig: ChatServiceConfig;
  defaultMessages?: ChatMessagesData[];
}

export class ChatEngine {
  private messages: ChatMessagesData[] = [];
  private status: 'idle' | 'pending' | 'streaming' | 'complete' | 'error' = 'idle';
  private abortController: AbortController | null = null;
  private chatServiceConfig: ChatServiceConfig | null = null;
  private listeners: Set<(messages: ChatMessagesData[], status: typeof this.status) => void> = new Set();

  init(config: ChatServiceConfig, defaultMessages?: ChatMessagesData[]) {
    this.chatServiceConfig = config;
    this.messages = defaultMessages || [];
    this.status = 'idle';
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.messages, this.status));
  }

  subscribe(listener: (messages: ChatMessagesData[], status: typeof this.status) => void) {
    this.listeners.add(listener);
    // 立即通知当前状态
    listener(this.messages, this.status);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setMessages(newMessages: ChatMessagesData[], mode: 'append' | 'replace' = 'append') {
    if (mode === 'replace') {
      this.messages = newMessages;
    } else {
      this.messages = [...this.messages, ...newMessages];
    }
    this.notifyListeners();
  }

  clearMessages() {
    this.messages = [];
    this.status = 'idle';
    this.notifyListeners();
  }

  getMessages() {
    return [...this.messages];
  }

  getStatus() {
    return this.status;
  }

  async sendUserMessage(params: ChatRequestParams) {
    if (!this.chatServiceConfig) {
      console.error('[ChatEngine] Chat service config is missing');
      return;
    }

    if (this.status === 'streaming' || this.status === 'pending') {
      console.warn('[ChatEngine] Cannot send message while streaming');
      return;
    }

    // Add user message
    const userMessage: ChatMessagesData = {
      id: Date.now().toString(),
      role: 'user',
      content: params.prompt,
      status: 'complete',
    };
    this.messages.push(userMessage);
    this.status = 'pending';
    this.notifyListeners();

    // Add assistant placeholder
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessagesData = {
      id: assistantId,
      role: 'assistant',
      content: '',
      reasoning: '',
      status: 'pending',
    };
    this.messages.push(assistantMessage);
    this.notifyListeners();

    // Prepare request
    let fetchParams: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const endpoint = this.chatServiceConfig.endpoint;

    if (this.chatServiceConfig.onRequest) {
      const customParams = this.chatServiceConfig.onRequest(params);
      if (customParams) {
        fetchParams = { ...fetchParams, ...customParams };
      }
    }

    this.abortController = new AbortController();
    fetchParams.signal = this.abortController.signal;

    try {
      if (this.chatServiceConfig.onStart) {
        this.chatServiceConfig.onStart();
      }

      const response = await fetch(endpoint, fetchParams);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      this.status = 'streaming';
      assistantMessage.status = 'streaming';
      this.notifyListeners();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;

          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;

            try {
              const data: SSEChunkData = JSON.parse(dataStr);
              const delta = data.choices?.[0]?.delta || {};

              // Content
              if (delta.content) {
                assistantMessage.content += delta.content;
              }

              // Reasoning
              if (delta.reasoning_content) {
                assistantMessage.reasoning = (assistantMessage.reasoning || '') + delta.reasoning_content;
              }

              // Support direct properties if flat
              if (typeof (data as any).content === 'string' && !delta.content) {
                assistantMessage.content += (data as any).content;
              }

              this.notifyListeners();
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      assistantMessage.status = 'complete';
      this.status = 'complete';
      this.notifyListeners();

      if (this.chatServiceConfig.onComplete) {
        this.chatServiceConfig.onComplete(false, fetchParams, {});
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        assistantMessage.status = 'complete';
        this.status = 'complete';
        if (this.chatServiceConfig.onComplete) {
          this.chatServiceConfig.onComplete(true, fetchParams, {});
        }
      } else {
        assistantMessage.status = 'error';
        this.status = 'error';
        if (this.chatServiceConfig.onError) {
          this.chatServiceConfig.onError(err);
        }
      }
      this.notifyListeners();
    } finally {
      this.abortController = null;
    }
  }

  regenerateAIMessage() {
    const lastUserMsgIndex = this.messages.map((m) => m.role).lastIndexOf('user');
    if (lastUserMsgIndex !== -1) {
      const lastUserMsg = this.messages[lastUserMsgIndex];
      this.sendUserMessage({ prompt: lastUserMsg.content as string });
    }
  }

  abortChat() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;

      this.status = 'complete';
      const lastMsg = this.messages[this.messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant' && lastMsg.status === 'streaming') {
        lastMsg.status = 'complete';
      }

      if (this.chatServiceConfig?.onAbort) {
        this.chatServiceConfig.onAbort();
      }

      this.notifyListeners();
    }
  }
}

// Toolcall Registry
export interface ToolcallComponentProps<TArgs = any, TResult = any> {
  args: TArgs;
  result?: TResult;
  status: 'pending' | 'loading' | 'complete' | 'error';
}

export interface AgentToolcallConfig<TArgs extends object = any, TResult = any, TResponse = any> {
  name: string;
  description: string;
  parameters: Array<{ name: string; type: string; description?: string }>;
  component?: new (props: ToolcallComponentProps<TArgs, TResult>) => any;
  render?: (props: ToolcallComponentProps<TArgs, TResult>) => any;
  execute?: (args: TArgs) => Promise<TResult>;
}

class AgentToolcallRegistry {
  private registry: Map<string, AgentToolcallConfig> = new Map();

  register(config: AgentToolcallConfig) {
    this.registry.set(config.name, config);
  }

  unregister(name: string) {
    this.registry.delete(name);
  }

  get(name: string): AgentToolcallConfig | undefined {
    return this.registry.get(name);
  }

  getAll(): AgentToolcallConfig[] {
    return Array.from(this.registry.values());
  }

  clear() {
    this.registry.clear();
  }
}

export const agentToolcallRegistry = new AgentToolcallRegistry();

// State Manager for Agent State
class StateManager {
  private stateMap: Map<string, any> = new Map();
  private listeners: Set<(state: any, stateKey: string) => void> = new Set();

  setState(stateKey: string, state: any) {
    this.stateMap.set(stateKey, state);
    this.listeners.forEach((listener) => listener(state, stateKey));
  }

  getState(stateKey: string): any {
    return this.stateMap.get(stateKey);
  }

  subscribeToLatest(listener: (state: any, stateKey: string) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const stateManager = new StateManager();

// Export types
export type { ChatRequestParams, ChatMessagesData, ChatServiceConfig, SSEChunkData, ToolCall, ToolCallContent, ToolCallResult };

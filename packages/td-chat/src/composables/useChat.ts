import Vue from 'vue';
import { ChatRequestParams, ChatMessagesData } from '../types';

export const useChat = (config?: any) => {
  const messages = Vue.observable<{ value: ChatMessagesData[] }>({ value: (config?.defaultMessages || []).slice() });
  const status = Vue.observable<{ value: 'pending' | 'streaming' | 'complete' | 'error' }>({ value: 'complete' });
  let abortController: AbortController | null = null;

  const chatEngineImpl = {
    setMessages: (newMessages: ChatMessagesData[]) => {
      messages.value = newMessages;
    },
    clearMessages: () => {
      messages.value = [];
    },
    sendUserMessage: async (params: ChatRequestParams) => {
      if (status.value === 'streaming' || status.value === 'pending') return;

      const { chatServiceConfig } = config || {};
      if (!chatServiceConfig) {
        console.error('Chat service config is missing');
        return;
      }

      // Add user message
      messages.value.push({
        id: Date.now(),
        role: 'user',
        content: params.prompt,
      });

      // Add assistant placeholder
      const assistantId = Date.now() + 1;
      const assistantMessage: ChatMessagesData = {
        id: assistantId,
        role: 'assistant',
        content: '',
        reasoning: '', // Initialize reasoning
        status: 'pending',
      };
      messages.value.push(assistantMessage);
      
      status.value = 'pending';
      
      // Prepare request
      let fetchParams: RequestInit = {
        method: 'POST',
      };
      const endpoint = chatServiceConfig.endpoint;

      if (chatServiceConfig.onRequest) {
         const customParams = chatServiceConfig.onRequest(params);
         if (customParams) {
           fetchParams = { ...fetchParams, ...customParams };
         }
      }

      abortController = new AbortController();
      fetchParams.signal = abortController.signal;

      try {
        if (chatServiceConfig.onStart) chatServiceConfig.onStart();

        const response = await fetch(endpoint, fetchParams);

        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (!response.body) throw new Error('Response body is null');

        status.value = 'streaming';
        assistantMessage.status = 'streaming';

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          const lines = buffer.split('\n');
          // Handle potentially incomplete line
          buffer = lines.pop() || ''; 
          
          for (const line of lines) {
             const trimmed = line.trim();
             if (!trimmed || trimmed.startsWith(':')) continue;

             if (trimmed.startsWith('data: ')) {
               const dataStr = trimmed.slice(6);
               if (dataStr === '[DONE]') continue;

               try {
                 const data = JSON.parse(dataStr);
                 
                 // Handle AGUI / standard delta format
                 const delta = data.choices?.[0]?.delta || data.delta || data;
                 
                 // Content
                 if (delta.content) {
                   assistantMessage.content += delta.content;
                 }
                 
                 // Reasoning
                 if (delta.reasoning_content) {
                   assistantMessage.reasoning = (assistantMessage.reasoning || '') + delta.reasoning_content;
                 }
                 
                 // Support direct properties if flat
                 if (typeof data.content === 'string' && !delta.content) {
                    assistantMessage.content += data.content;
                 }
               } catch (e) {
                 // Ignore parse errors
               }
             }
          }
        }

        assistantMessage.status = 'complete';
        status.value = 'complete';
        if (chatServiceConfig.onComplete) chatServiceConfig.onComplete(false, fetchParams, {});

      } catch (err: any) {
        if (err.name === 'AbortError') {
           if (chatServiceConfig.onComplete) chatServiceConfig.onComplete(true, fetchParams, {});
        } else {
           assistantMessage.status = 'error';
           status.value = 'error';
           if (chatServiceConfig.onError) chatServiceConfig.onError(err);
        }
      } finally {
        abortController = null;
      }
    },
    regenerateAIMessage: () => {
      // Logic to resend last user message
      const lastUserMsgIndex = messages.value.map(m => m.role).lastIndexOf('user');
      if (lastUserMsgIndex !== -1) {
         const lastUserMsg = messages.value[lastUserMsgIndex];
         chatEngineImpl.sendUserMessage({ prompt: lastUserMsg.content });
      }
    },
    abortChat: () => {
      if (abortController) {
        abortController.abort();
        abortController = null;
        
        status.value = 'complete';
        const lastMsg = messages.value[messages.value.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.status === 'streaming') {
           lastMsg.status = 'complete';
        }

        if (config?.chatServiceConfig?.onAbort) {
           config.chatServiceConfig.onAbort();
        }
      }
    }
  };

  const chatEngine = Vue.observable<{ value: typeof chatEngineImpl }>({ value: chatEngineImpl });

  return {
    messages,
    chatEngine,
    status,
  };
};

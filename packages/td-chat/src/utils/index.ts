import { MessagePlugin } from 'tdesign-vue';
import Vue from 'vue';

// 单例模式解决复制成功提示只显示一次
export class MessagePluginSingleton {
  private static instance: MessagePluginSingleton;
  private messagePlugin: any;

  private constructor() {
    this.messagePlugin = null;
  }

  public static getInstance(): MessagePluginSingleton {
    if (!MessagePluginSingleton.instance) {
      MessagePluginSingleton.instance = new MessagePluginSingleton();
    }
    return MessagePluginSingleton.instance;
  }

  public showSuccess(copyTextSuccess: string): void {
    if (this.messagePlugin) {
      MessagePlugin.closeAll();
    }
    this.messagePlugin = MessagePlugin.success(copyTextSuccess, 1000);
  }
  public showError(copyTextFail: string): void {
    if (this.messagePlugin) {
      MessagePlugin.closeAll();
    }
    this.messagePlugin = MessagePlugin.error(copyTextFail, 1000);
  }
}

// withInstall 工具函数
export function withInstall<T>(component: T) {
  const comp = component as any;
  comp.install = function(Vue: typeof import('vue'), config?: Record<string, unknown>) {
    Vue.component(comp.name, comp);
  };
  return comp as T & { install: (Vue: typeof import('vue'), config?: Record<string, unknown>) => void };
}

// Helpers
export const isAIMessage = (item: { role: string }) => {
  return item?.role === 'assistant' || item?.role === 'model';
};

export const getMessageContentForCopy = (item: { content: any }) => {
  if (typeof item.content === 'string') return item.content;
  if (Array.isArray(item.content)) {
    return item.content
      .map((segment) => {
        if (typeof segment === 'string') return segment;
        if (segment.type === 'text') return segment.data;
        // Skip reasoning/toolcalls for simple copy? Or stringify them?
        // Demo seems to expect simple text.
        return '';
      })
      .join('');
  }
  return '';
};

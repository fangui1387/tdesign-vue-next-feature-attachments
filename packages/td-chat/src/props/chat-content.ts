/* eslint-disable */

import { TdChatContentProps } from '../types';
import { PropType } from 'vue';

export default {
  /** 聊天内容，支持 markdown 格式 */
  content: {
    type: String,
    default: '',
  },
  /** 角色，不同选项配置不同的样式，支持类型包括用户、助手、错误、模型切换、系统消息 */
  role: {
    type: String as PropType<TdChatContentProps['role']>,
    validator(val: TdChatContentProps['role']): boolean {
      if (!val) return true;
      return ['user', 'assistant', 'error', 'model-change', 'system'].includes(val);
    },
  },
};

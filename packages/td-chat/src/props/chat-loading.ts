/* eslint-disable */

import { TdChatLoadingProps } from '../types';
import { PropType } from 'vue';

export default {
  /** 加载的状态形式 */
  animation: {
    type: String as PropType<TdChatLoadingProps['animation']>,
    default: 'gradient' as TdChatLoadingProps['animation'],
    validator(val: TdChatLoadingProps['animation']): boolean {
      if (!val) return true;
      return ['moving', 'gradient'].includes(val);
    },
  },
  /** 加载过程展示的文字内容 */
  text: {
    type: String,
    default: '',
  },
};

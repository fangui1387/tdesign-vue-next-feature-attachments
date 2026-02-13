/* eslint-disable */

import { TdChatActionProps } from '../types';
import { PropType } from 'vue';

export default {
  /** 被复制的内容 */
  content: {
    type: String,
    default: '',
  },
  /** 操作按钮是否可点击 */
  disabled: Boolean,
  /** 评价类型，可选值：'good(点赞)'/'bad(点踩)'，默认为空 */
  comment: {
    type: String as PropType<TdChatActionProps['comment']>,
    default: '' as TdChatActionProps['comment'],
    validator(val: TdChatActionProps['comment']): boolean {
      if (!val) return true;
      return ['good', 'bad', ''].includes(val);
    },
  },
  /** 是否点踩（待废弃，请尽快使用comment） @deprecated */
  isBad: Boolean,
  /** 是否点赞（待废弃，请尽快使用comment） @deprecated */
  isGood: Boolean,
  /** 操作按钮配置项，可配置操作按钮选项和顺序（推荐使用） */
  actionBar: {
    type: Array as PropType<TdChatActionProps['actionBar']>,
    default: (): TdChatActionProps['actionBar'] => ['replay', 'copy', 'good', 'bad'],
  },
  /** 操作按钮配置项，可配置操作按钮选项和顺序（待废弃，请尽快使用actionBar） @deprecated */
  operationBtn: {
    type: Array as PropType<TdChatActionProps['operationBtn']>,
    default: (): TdChatActionProps['operationBtn'] => ['replay', 'copy', 'good', 'bad'],
  },
  /** 点击点赞，点踩，复制，重新生成按钮时触发（推荐使用） */
  onActions: Function as PropType<TdChatActionProps['onActions']>,
  /** 点击点赞，点踩，复制，重新生成按钮时触发（待废弃，请尽快使用onActions） @deprecated */
  onOperation: Function as PropType<TdChatActionProps['onOperation']>,
};

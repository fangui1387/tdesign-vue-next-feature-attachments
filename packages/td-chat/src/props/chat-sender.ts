/* eslint-disable */

import { TdChatSenderProps } from '../types';
import { PropType } from 'vue';

export default {
  /** 是否禁用输入框 */
  disabled: Boolean,
  /** 输入框默认文案 */
  placeholder: {
    type: String,
    default: '',
  },
  /** 输入框左下角区域扩展（推荐使用） */
  footerPrefix: {
    type: [String, Function] as PropType<TdChatSenderProps['footerPrefix']>,
  },
  /** 输入框左下角区域扩展（兼容旧版本）@deprecated */
  prefix: {
    type: [String, Function] as PropType<TdChatSenderProps['prefix']>,
  },
  /** 发送按钮是否处于加载状态，待废弃，请尽快使用 loading 替换 @deprecated */
  stopDisabled: {
    type: Boolean as PropType<TdChatSenderProps['stopDisabled']>,
    default: false,
  },
  /** 发送按钮是否处于加载状态 */
  loading: {
    type: Boolean as PropType<TdChatSenderProps['loading']>,
    default: false,
  },
  /** 输入框右下角区域扩展 */
  suffix: {
    type: [String, Function] as PropType<TdChatSenderProps['suffix']>,
  },
  /** 透传给 Textarea 组件的全部属性 */
  textareaProps: {
    type: Object as PropType<TdChatSenderProps['textareaProps']>,
  },
  /** 附件配置属性 */
  attachmentsProps: {
    type: Object as PropType<TdChatSenderProps['attachmentsProps']>,
  },
  /** 输入框的值 */
  value: {
    type: [String, Number] as PropType<TdChatSenderProps['value']>,
    default: undefined as TdChatSenderProps['value'],
  },
  modelValue: {
    type: [String, Number] as PropType<TdChatSenderProps['value']>,
    default: undefined as TdChatSenderProps['value'],
  },
  /** 输入框的值，非受控属性 */
  defaultValue: {
    type: [String, Number] as PropType<TdChatSenderProps['defaultValue']>,
  },
  /** 输入框聚焦时触发 */
  onBlur: Function as PropType<TdChatSenderProps['onBlur']>,
  /** 输入框值发生变化时触发 */
  onChange: Function as PropType<TdChatSenderProps['onChange']>,
  /** 输入框聚焦时触发 */
  onFocus: Function as PropType<TdChatSenderProps['onFocus']>,
  /** 点击消息发送的回调方法 */
  onSend: Function as PropType<TdChatSenderProps['onSend']>,
  /** 点击消息终止的回调方法 */
  onStop: Function as PropType<TdChatSenderProps['onStop']>,
};

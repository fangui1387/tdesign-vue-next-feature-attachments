<template>
  <div :class="`${COMPONENT_NAME}-sender`">
    <div :class="`${COMPONENT_NAME}-sender__header`">
      <t-node :content="renderTNodeJSX('header')" />
    </div>
    <div
      :class="[
        `${COMPONENT_NAME}-sender__textarea`,
        focusFlag ? `${COMPONENT_NAME}-sender__textarea--focus` : '',
      ]"
    >
      <div :class="`${COMPONENT_NAME}-sender__inner-header`">
        <t-node :content="renderTNodeJSX('inner-header')" />
      </div>
      <t-textarea
        ref="senderTextarea"
        v-model="textValue"
        :disabled="disabled || showStopBtn"
        :autosize="textareaAutosize"
        v-bind="textareaProps"
        @change="textChange"
        @keydown="keydownFn"
        @focus="focusFn"
        @blur="blurFn"
        @compositionstart="compositionstartFn"
        @compositionend="compositionendFn"
      />
      <div :class="`${COMPONENT_NAME}-sender__footer`">
        <div :class="`${COMPONENT_NAME}-sender__mode`">
          <t-node :content="renderTNodeJSX('prefix')" />
        </div>
        <div :class="`${COMPONENT_NAME}-sender__button`">
          <div :class="`${COMPONENT_NAME}-sender__button__sendbtn`">
            <t-node :content="suffixContent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  SendIcon as TIconSendFilled,
  AttachIcon as TIconFileAttachment,
  ImageIcon as TIconImage,
} from 'tdesign-icons-vue';
import { Button as TButton, Textarea as TTextarea, Tooltip as TTooltip } from 'tdesign-vue';
import props from '../props/chat-sender';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useConfig } from '../composables/useConfig';
import { useTNodeJSX } from '../composables/useTNodeJSX';
import TNode from './TNode.vue';
import type { UploadActionType, UploadActionConfig } from '../types';

export default Vue.extend({
  name: 'TChatSender',
  components: {
    TButton,
    TTextarea,
    TTooltip,
    TIconSendFilled,
    TIconFileAttachment,
    TIconImage,
    TNode,
  },
  props,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  data() {
    return {
      innerValue: (this as any).defaultValue || '',
      focusFlag: false,
      isComposition: false,
      actionsDefault: [
        {
          name: 'uploadImage',
          uploadProps: {
            multiple: true,
            accept: 'image/*',
          },
          action: ({ files, name }: any) => {
            this.$emit('fileSelect', { files, name });
          },
        },
        {
          name: 'uploadAttachment',
          action: ({ files, name }: any) => {
            this.$emit('fileSelect', { files, name });
          },
        },
      ] as UploadActionConfig[],
    };
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    globalConfig(): any {
      return useConfig('chat').globalConfig;
    },
    showStopBtn(): boolean {
      return !!((this as any).loading || (this as any).stopDisabled);
    },
    disabled(): boolean {
      return !!((this as any).$props.disabled || false);
    },
    textareaAutosize(): any {
      return ((this as any).textareaProps && (this as any).textareaProps.autosize) || { minRows: 2, maxRows: 5 };
    },
    textValue: {
      get(): any {
        if ((this as any).modelValue !== undefined) return (this as any).modelValue;
        if ((this as any).value !== undefined) return (this as any).value;
        return (this as any).innerValue;
      },
      set(val: any) {
        (this as any).setInnerValue(val, { e: undefined });
      },
    },
    suffixContent(): any {
      const renderTNodeJSX = useTNodeJSX(this);
      const suffix = renderTNodeJSX('suffix', { params: { renderPresets: (this as any).getDefaultSuffixIcon } });
      return suffix ? suffix : (this as any).getDefaultSuffixIcon();
    },
  },
  methods: {
    renderTNodeJSX(name: string, options: any = {}) {
      return useTNodeJSX(this)(name, options);
    },
    isControlled() {
      return (this as any).modelValue !== undefined || (this as any).value !== undefined;
    },
    setInnerValue(val: any, context: any) {
      if (!(this as any).isControlled()) {
        (this as any).innerValue = val;
      }
      this.$emit('input', val);
      this.$emit('update:value', val);
      this.$emit('update:modelValue', val);
      this.$emit('change', val, context);
      if (typeof (this as any).onChange === 'function') {
        (this as any).onChange(val, context);
      }
    },
    sendClick(e: MouseEvent | KeyboardEvent) {
      const val = (this as any).textValue;
      if (val && !(this as any).disabled) {
        this.$emit('send', val, { e });
        if (typeof (this as any).onSend === 'function') {
          (this as any).onSend(val, { e });
        }
      }
    },
    handleStop(e: MouseEvent) {
      e.stopPropagation();
      const val = (this as any).textValue;
      this.$emit('stop', val, { e });
      if (typeof (this as any).onStop === 'function') {
        (this as any).onStop(val, { e });
      }
    },
    keydownFn(value: string, context: { e: KeyboardEvent }) {
      const { key, shiftKey } = context.e;
      if (key !== 'Enter') return;
      if ((this as any).isComposition || (context.e as any).isComposing) return;
      if (shiftKey) return;
      context.e.preventDefault();
      context.e.stopPropagation();
      (this as any).sendClick(context.e);
    },
    focusFn(value: string, context: { e: FocusEvent }) {
      (this as any).focusFlag = true;
      this.$emit('focus', value, context);
      if (typeof (this as any).onFocus === 'function') {
        (this as any).onFocus(value, context);
      }
    },
    blurFn(value: string, context: { e: FocusEvent }) {
      (this as any).focusFlag = false;
      this.$emit('blur', value, context);
      if (typeof (this as any).onBlur === 'function') {
        (this as any).onBlur(value, context);
      }
    },
    textChange(value: string, context: { e: InputEvent }) {
      (this as any).setInnerValue(value, context);
    },
    compositionstartFn() {
      (this as any).isComposition = true;
    },
    compositionendFn() {
      (this as any).isComposition = false;
    },
    handleFileChange(e: Event, action: UploadActionConfig) {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      if (!files.length) return;
      const defaultAction = ((this as any).actionsDefault as UploadActionConfig[]).find((item) => item.name === action.name);
      const finalAction = action.action || (defaultAction && defaultAction.action);
      if (finalAction) {
        finalAction({ files, name: action.name });
      }
      target.value = '';
    },
    getDefaultSuffixIcon(actions: UploadActionConfig[] = (this as any).actionsDefault) {
      const h = this.$createElement;
      const children: any[] = [];

      const { uploadAttachmentText, uploadImageText } = (this as any).globalConfig;

      const uploadAttachment = actions.find((item) => item.name === 'uploadAttachment');
      if (uploadAttachment) {
        children.push(
          h('input', {
            attrs: { type: 'file', hidden: true, ...(uploadAttachment.uploadProps || {}) },
            ref: 'uploadFileRef',
            on: { change: (e: Event) => (this as any).handleFileChange(e, uploadAttachment) },
          }),
        );
        children.push(
          h(TTooltip as any, { props: { content: uploadAttachmentText } }, [
            h(
              TButton as any,
              {
                props: { theme: 'default', shape: 'circle', variant: 'text' },
                class: `${(this as any).COMPONENT_NAME}-sender__upload`,
                on: {
                  click: () => ((this as any).$refs.uploadFileRef as HTMLInputElement | undefined)?.click(),
                },
              },
              [h(TIconFileAttachment as any)],
            ),
          ]),
        );
      }

      const uploadImage = actions.find((item) => item.name === 'uploadImage');
      if (uploadImage) {
        children.push(
          h('input', {
            attrs: { type: 'file', hidden: true, ...(uploadImage.uploadProps || {}) },
            ref: 'uploadImageRef',
            on: { change: (e: Event) => (this as any).handleFileChange(e, uploadImage) },
          }),
        );
        children.push(
          h(TTooltip as any, { props: { content: uploadImageText } }, [
            h(
              TButton as any,
              {
                props: { theme: 'default', shape: 'circle', variant: 'text' },
                class: `${(this as any).COMPONENT_NAME}-sender__upload`,
                on: {
                  click: () => ((this as any).$refs.uploadImageRef as HTMLInputElement | undefined)?.click(),
                },
              },
              [h(TIconImage as any)],
            ),
          ]),
        );
      }

      if (!(this as any).showStopBtn) {
        children.push(
          h(
            TButton as any,
            {
              props: {
                theme: 'default',
                size: 'small',
                variant: 'text',
                disabled: (this as any).disabled || (this as any).showStopBtn || !(this as any).textValue,
              },
              class: [
                `${(this as any).COMPONENT_NAME}-sender__button__default`,
                (this as any).textValue ? '' : `${(this as any).COMPONENT_NAME}-sender__button--disabled`,
              ],
              on: { click: (e: MouseEvent) => (this as any).sendClick(e) },
            },
            [h(TIconSendFilled as any)],
          ),
        );
      } else {
        children.push(
          h(
            TButton as any,
            {
              props: { variant: 'text' },
              class: `${(this as any).COMPONENT_NAME}-sender__button__default`,
              on: { click: (e: MouseEvent) => (this as any).handleStop(e) },
            },
            [h('div', { class: `${(this as any).COMPONENT_NAME}-sender__button__stopicon` })],
          ),
        );
      }

      return children;
    },
  },
});
</script>

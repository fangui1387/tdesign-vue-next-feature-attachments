<template>
  <div :class="`${COMPONENT_NAME}__footer__content`">
    <div :class="`${COMPONENT_NAME}__footer__textarea`">
      <t-textarea
        v-model="textValue"
        class="noscrollbar"
        :placeholder="placeholderText"
        :disabled="textareaDisabled"
        :autofocus="autofocus"
        :autosize="autosize"
        @change="textChange"
        @blur="blurFn"
        @focus="focusFn"
        @keydown="keydownFn"
        @keyup="keyupFn"
        @compositionstart="compositionstartFn"
        @compositionend="compositionendFn"
      />
      <div :class="`${COMPONENT_NAME}__footer__textarea__icon`" @click="sendClick">
        <t-node :content="suffixIconContent" />
      </div>
    </div>
    <div v-if="disabled && !textareaDisabled" :class="`${COMPONENT_NAME}__footer__stopbtn`">
      <t-button variant="outline" @click="handleStop">
        <t-icon-stop-circle />
        {{ globalConfig.stopBtnText }}
      </t-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SendIcon as TIconSend, StopCircleIcon as TIconStopCircle } from 'tdesign-icons-vue';
import { Button as TButton, Textarea as TTextarea } from 'tdesign-vue';
import props from '../props/chat-input';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useConfig } from '../composables/useConfig';
import { useTNodeJSX } from '../composables/useTNodeJSX';
import TNode from './TNode.vue';

export default Vue.extend({
  name: 'TChatInput',
  components: {
    TButton,
    TTextarea,
    TIconSend,
    TIconStopCircle,
    TNode,
  },
  props,
  data() {
    return {
      innerValue: (this as any).defaultValue || '',
      shiftDownFlag: false,
      isComposition: false,
    };
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    globalConfig(): any {
      return useConfig('chat').globalConfig;
    },
    disabled(): boolean {
      return !!(this as any).$props.stopDisabled;
    },
    textareaDisabled(): boolean {
      return !!(this as any).$props.disabled;
    },
    placeholderText(): string {
      return (this as any).placeholder || (this as any).globalConfig.placeholder;
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
    suffixIconContent(): any {
      const renderTNodeJSX = useTNodeJSX(this);
      const customIcon = renderTNodeJSX('suffixIcon');
      if (customIcon) return customIcon;

      return this.$createElement(
        TButton as any,
        {
          class: [
            `${(this as any).COMPONENT_NAME}__footer__textarea__icon__default`,
            (this as any).textValue ? `${(this as any).COMPONENT_NAME}__footer__textarea__icon--focus` : '',
          ],
          props: {
            theme: 'default',
            size: 'small',
            variant: 'text',
            disabled: (this as any).disabled || !(this as any).textValue || (this as any).textareaDisabled,
          },
        },
        [this.$createElement(TIconSend as any)],
      );
    },
  },
  methods: {
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
        (this as any).setInnerValue('', { e });
      }
    },
    handleStop(e: MouseEvent) {
      const val = (this as any).textValue;
      this.$emit('stop', val, { e });
      if (typeof (this as any).onStop === 'function') {
        (this as any).onStop(val, { e });
      }
    },
    textChange(value: string, context: { e: InputEvent }) {
      (this as any).setInnerValue(value, context);
    },
    blurFn(value: string, context: { e: FocusEvent }) {
      (this as any).shiftDownFlag = false;
      this.$emit('blur', value, context);
      if (typeof (this as any).onBlur === 'function') {
        (this as any).onBlur(value, context);
      }
    },
    focusFn(value: string, context: { e: FocusEvent }) {
      this.$emit('focus', value, context);
      if (typeof (this as any).onFocus === 'function') {
        (this as any).onFocus(value, context);
      }
    },
    keydownFn(value: string, context: { e: KeyboardEvent }) {
      const { key } = context.e;
      if (key === 'Shift') {
        (this as any).shiftDownFlag = true;
      }
      if (key === 'Enter' && !(this as any).shiftDownFlag && !(this as any).isComposition) {
        context.e.preventDefault();
        context.e.stopPropagation();
        (this as any).sendClick(context.e);
      }
    },
    keyupFn(value: string, context: { e: KeyboardEvent }) {
      const { key } = context.e;
      if (key === 'Shift') {
        (this as any).shiftDownFlag = false;
      }
    },
    compositionstartFn() {
      (this as any).isComposition = true;
    },
    compositionendFn() {
      (this as any).isComposition = false;
    },
  },
});
</script>

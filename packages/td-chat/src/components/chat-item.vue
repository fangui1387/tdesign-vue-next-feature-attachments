<template>
  <div :class="[`${COMPONENT_NAME}__inner`, roleValue, `${COMPONENT_NAME}__text--variant--${variantValue}`]">
    <template v-if="roleValue !== 'model-change'">
      <div v-if="avatar" :class="`${COMPONENT_NAME}__avatar`">
        <div :class="`${COMPONENT_NAME}__avatar__box`">
          <img v-if="isStringAvatar" :src="avatar" alt="" :class="`${COMPONENT_NAME}__avatar-image`" />
          <t-node v-else :content="avatar" />
        </div>
      </div>
    </template>

    <div :class="contentClasses">
      <template v-if="roleValue !== 'model-change'">
        <div v-if="showNameDatetime" :class="`${COMPONENT_NAME}__base`">
          <span v-if="name" :class="`${COMPONENT_NAME}__name`">
            <t-node :content="name" />
          </span>
          <span v-if="datetime" :class="`${COMPONENT_NAME}__time`">
            <t-node :content="datetime" />
          </span>
        </div>
      </template>

      <template v-if="textLoading">
        <t-skeleton v-if="animation === 'skeleton'" :loading="true" animation="gradient" />
        <chat-loading v-else :loading="true" :animation="animation" />
      </template>

      <template v-else>
        <div :class="`${COMPONENT_NAME}__detail`">
          <!-- Object Reasoning -->
          <chat-reasoning
            v-if="isObjectReasoning && roleValue === 'assistant'"
            :role="roleValue"
            :expand-icon-placement="reasoning.expandIconPlacement"
            @expand-change="reasoning.onExpandChange"
            :collapse-panel-props="reasoning.collapsePanelProps"
          />
          <!-- String Reasoning -->
          <chat-reasoning
            v-else-if="isStringReasoning && roleValue === 'assistant'"
            :role="roleValue"
            expand-icon-placement="right"
            :collapse-panel-props="stringReasoningProps"
          />

          <!-- Content -->
          <chat-content
            v-if="isStringContent"
            :content="content"
            :role="roleValue"
            :is-normal-text="false"
          />
          <t-node v-else :content="content" />
        </div>

        <!-- Actions -->
        <div v-if="roleValue === 'assistant' && showActions" :class="`${COMPONENT_NAME}__actions-margin`">
          <t-node :content="showActions" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Skeleton as TSkeleton } from 'tdesign-vue';
import { isString, isObject } from 'lodash-es';
import { CheckCircleIcon } from 'tdesign-icons-vue';
import props from '../props/chat-item';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useConfig } from '../composables/useConfig';
import { useTNodeJSX } from '../composables/useTNodeJSX';
import ChatContent from './chat-content.vue';
import ChatLoading from './chat-loading.vue';
import ChatReasoning from './chat-reasoning.vue';
import TNode from './TNode.vue';

export default Vue.extend({
  name: 'TChatItem',
  components: {
    ChatContent,
    ChatLoading,
    ChatReasoning,
    TSkeleton,
    TNode,
  },
  props: {
    ...props,
    reasoningLoading: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      getRole: () => (this as any).roleValue,
    };
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    globalConfig(): any {
      return useConfig('chat').globalConfig;
    },
    roleValue(): string {
      const renderTNodeJSX = useTNodeJSX(this);
      const slotRole = renderTNodeJSX('role');
      return (slotRole as any) || (this as any).role || '';
    },
    variantValue(): string {
      const renderTNodeJSX = useTNodeJSX(this);
      const slotVariant = renderTNodeJSX('variant');
      return (slotVariant as any) || (this as any).variant || 'base';
    },
    name(): any {
      return useTNodeJSX(this)('name', { slotFirst: true }) || (this as any).$props.name;
    },
    datetime(): any {
      return useTNodeJSX(this)('datetime', { slotFirst: true }) || (this as any).$props.datetime;
    },
    avatar(): any {
      return useTNodeJSX(this)('avatar', { slotFirst: true }) || (this as any).$props.avatar;
    },
    content(): any {
      return useTNodeJSX(this)('content', { slotFirst: true }) || (this as any).$props.content;
    },
    showActions(): any {
      return useTNodeJSX(this)('actions');
    },
    showNameDatetime(): boolean {
      return !!((this as any).name || (this as any).datetime);
    },
    contentClasses(): any[] {
      return [
        `${(this as any).COMPONENT_NAME}__content`,
        !(this as any).showNameDatetime ? `${(this as any).COMPONENT_NAME}__content--base` : '',
      ];
    },
    isStringAvatar(): boolean {
      return isString((this as any).avatar);
    },
    isObjectReasoning(): boolean {
      return isObject((this as any).reasoning) && (this as any).reasoning !== true;
    },
    isStringReasoning(): boolean {
      return isString((this as any).reasoning);
    },
    stringReasoningProps(): any {
      return {
        header: (this as any).renderHeader(),
        content: this.$createElement(ChatContent as any, {
          props: { isNormalText: false, content: (this as any).reasoning, role: (this as any).roleValue },
        }),
      };
    },
    isStringContent(): boolean {
      return isString((this as any).content);
    },
  },
  methods: {
    renderHeader() {
      const { loadingText, loadingEndText } = (this as any).globalConfig;
      if ((this as any).reasoningLoading) {
        return this.$createElement(ChatLoading as any, { props: { text: loadingText } });
      }
      return this.$createElement('div', { style: 'display:flex;align-items:center' }, [
        this.$createElement(CheckCircleIcon as any, {
          style: {
            color: 'var(--td-success-color-5)',
            fontSize: '20px',
            marginRight: '8px',
          },
        }),
        this.$createElement('span', loadingEndText),
      ]);
    },
  },
});
</script>

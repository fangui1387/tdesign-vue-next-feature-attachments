<template>
  <div :class="classes">
    <div ref="chatBoxRef" :class="listClasses" @scroll="handleScroll">
      <div v-if="reverse" class="place-holder"></div>

      <div v-if="reverse && clearHistory">
        <t-node :content="renderClearHistory" />
      </div>

      <template v-if="displayData && displayData.length > 0">
        <chat-item
          v-for="(item, index) in displayData"
          :key="index"
          :avatar="item.avatar"
          :name="item.name"
          :role="item.role"
          :datetime="item.datetime"
          :content="item.content"
          :reasoning="setReasoning(item)"
          :reasoning-loading="isReasoningLoading(index)"
          :text-loading="isLoading(index)"
          :item-index="index"
          :animation="animation"
        >
          <template #actions>
            <t-node :content="renderTNodeJSX('actions', { params: { item, index } })" />
          </template>
          <template #name>
            <t-node :content="renderTNodeJSX('name', { params: { item, index } })" />
          </template>
          <template #avatar>
            <t-node :content="renderTNodeJSX('avatar', { params: { item, index } })" />
          </template>
          <template #datetime>
            <t-node :content="renderTNodeJSX('datetime', { params: { item, index } })" />
          </template>
          <template #content>
            <t-node :content="renderTNodeJSX('content', { params: { item, index } })" />
          </template>
        </chat-item>
      </template>
      <t-node v-else :content="renderTNodeJSX('default')" />

      <div v-if="!reverse && clearHistory">
        <t-node :content="renderClearHistory" />
      </div>
    </div>
    <div v-if="showFooter" :class="`${COMPONENT_NAME}__footer`">
      <t-node :content="showFooter" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ClearIcon as TIconClear } from 'tdesign-icons-vue';
import { Divider as TDivider, Popconfirm as TPopconfirm } from 'tdesign-vue';
import props from '../props/chat';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useConfig } from '../composables/useConfig';
import { useTNodeJSX } from '../composables/useTNodeJSX';
import ChatItem from './chat-item.vue';
import TNode from './TNode.vue';
import { TdChatItemProps, ScrollToBottomParams } from '../types';

export default Vue.extend({
  name: 'TChat',
  components: {
    ChatItem,
    TIconClear,
    TDivider,
    TPopconfirm,
    TNode,
  },
  props,
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    globalConfig(): any {
      return useConfig('chat').globalConfig;
    },
    classes(): any[] {
      return [
        (this as any).COMPONENT_NAME,
        {
          [`${(this as any).COMPONENT_NAME}--normal`]: (this as any).layout === 'both',
        },
      ];
    },
    listClasses(): any[] {
      return [
        `${(this as any).COMPONENT_NAME}__list`,
        {
          [`${(this as any).COMPONENT_NAME}__list--reverse`]: !!(this as any).reverse,
        },
      ];
    },
    displayData(): any[] {
      return ((this as any).data as any[]) || [];
    },
    renderClearHistory(): any {
      const h = this.$createElement;
      const defaultNode = h(
        TPopconfirm as any,
        {
          props: { content: (this as any).globalConfig.confirmClearHistory },
          on: { confirm: (context: any) => (this as any).clearConfirm(context) },
        },
        [
          h(TDivider as any, { class: 'clear-btn' }, [
            h(TIconClear as any, { props: { size: '14px' } }),
            h('span', { class: 'clear-btn-text' }, (this as any).globalConfig.clearHistoryBtnText),
          ]),
        ],
      );
      return useTNodeJSX(this)('clearHistory', { defaultNode });
    },
    showFooter(): any {
      return useTNodeJSX(this)('footer');
    },
  },
  methods: {
    renderTNodeJSX(name: string, options: any = {}) {
      return useTNodeJSX(this)(name, options);
    },
    isLoading(index: number) {
      const len = ((this as any).data && (this as any).data.length) || 0;
      const isLast = (this as any).reverse ? index === 0 : index === len - 1;
      return isLast && !!(this as any).textLoading;
    },
    isReasoningLoading(index: number) {
      const len = ((this as any).data && (this as any).data.length) || 0;
      const isLast = (this as any).reverse ? index === 0 : index === len - 1;
      return isLast && !!(this as any).isStreamLoad;
    },
    setReasoning(item: TdChatItemProps) {
      const hasContentSlot = !!((this as any).$scopedSlots?.content || (this as any).$slots?.content);
      return hasContentSlot ? false : (item as any).reasoning;
    },
    clearConfirm(context: { e: MouseEvent }) {
      this.$emit('clear', context);
      if (typeof (this as any).onClear === 'function') {
        (this as any).onClear(context);
      }
    },
    handleScrollToBottom(target: HTMLDivElement, behavior?: 'auto' | 'smooth') {
      const currentScrollHeight = target.scrollHeight;
      const currentClientHeight = target.clientHeight;
      const innerBehavior = behavior || 'auto';

      if (innerBehavior === 'auto') {
        target.scrollTop = currentScrollHeight - currentClientHeight;
      } else {
        const startScrollTop = target.scrollTop;
        const endScrollTop = currentScrollHeight - currentClientHeight;
        const duration = 300;
        const step = (endScrollTop - startScrollTop) / duration;
        let startTime: number | undefined;

        const animateScroll = (time: number) => {
          if (!startTime) startTime = time;
          const elapsed = time - startTime;
          const top = Math.min(endScrollTop, startScrollTop + elapsed * step);
          target.scrollTop = top;
          if (top < endScrollTop) requestAnimationFrame(animateScroll);
        };
        requestAnimationFrame(animateScroll);
      }
    },
    scrollToBottom(data: ScrollToBottomParams) {
      const el = (this.$refs.chatBoxRef as HTMLDivElement | undefined) || undefined;
      if (!el) return;
      const { behavior = 'auto' } = data || {};
      (this as any).handleScrollToBottom(el, behavior);
    },
    handleScroll(e: Event) {
      this.$emit('scroll', { e });
      if (typeof (this as any).onScroll === 'function') {
        (this as any).onScroll({ e });
      }
    },
  },
});
</script>

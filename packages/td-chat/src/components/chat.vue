<template>
  <div :class="classes">
    <div ref="listRef" :class="listClasses" @scroll="handleScroll">
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
          :animation="animation"
          :placement="setPlacement(item)"
        >
          <template #actions>
            <t-node :content="renderTNodeJSX('actionbar', { params: { item, index } }) || renderTNodeJSX('actions', { params: { item, index } })" />
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

      <div v-if="!reverse" ref="innerRef"></div>
    </div>

    <div v-if="showFooter" :class="`${COMPONENT_NAME}__footer`">
      <t-node :content="showFooter" />
    </div>

    <t-button
      v-if="showScrollButton && scrollButtonVisible"
      variant="text"
      :class="`${COMPONENT_NAME}__to-bottom`"
      @click="backBottom"
    >
      <div :class="`${COMPONENT_NAME}__to-bottom-inner`">
        <arrow-down-icon />
      </div>
    </t-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ClearIcon as TIconClear, ArrowDownIcon } from 'tdesign-icons-vue';
import { Divider as TDivider, Popconfirm as TPopconfirm, Button as TButton } from 'tdesign-vue';
import { throttle, debounce } from 'lodash-es';
import props from '../props/chat';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useConfig } from '../composables/useConfig';
import { useTNodeJSX } from '../composables/useTNodeJSX';
import ChatItem from './chat-item.vue';
import TNode from './TNode.vue';
import { TdChatItemProps, ScrollToBottomParams, TdChatItemMeta } from '../types';

export default Vue.extend({
  name: 'TChat',
  components: {
    ChatItem,
    TIconClear,
    TDivider,
    TPopconfirm,
    TNode,
    TButton,
    ArrowDownIcon,
  },
  props,
  data() {
    return {
      scrollButtonVisible: false,
      scrollTopTmp: 0,
      scrollHeightTmp: 0,
      preventAutoScroll: false,
      isAutoScrollEnabled: false,
      observer: null as ResizeObserver | null,
    };
  },
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
  mounted() {
    const { defaultScrollTo } = this.$props;
    if (defaultScrollTo === 'bottom' && !this.$props.reverse) {
      (this as any).isAutoScrollEnabled = true;
    }

    const list = (this.$refs.listRef as HTMLDivElement);
    const inner = (this.$refs.innerRef as HTMLDivElement);

    // 初始化"回到底部"按钮显示状态
    (this as any).checkAndShowScrollButton();

    if (list && typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => {
        if (list?.scrollHeight !== (this as any).scrollHeightTmp) {
          (this as any).handleAutoScroll();
        }
        (this as any).scrollHeightTmp = list?.scrollHeight || 0;
      });
      if (inner) {
        this.observer.observe(inner);
      }
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
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
    setPlacement(item: TdChatItemMeta): 'left' | 'right' {
      if ((this as any).layout === 'both') {
        if (item.role === 'assistant') return 'left';
        if (item.role === 'user') return 'right';
        return 'left';
      }
      return 'left';
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
    scrollToBottom(data?: ScrollToBottomParams) {
      const el = (this.$refs.listRef as HTMLDivElement | undefined) || undefined;
      if (!el) return;
      const { behavior = 'auto' } = data || {};
      (this as any).handleScrollToBottom(el, behavior);
    },
    handleScroll(e: Event) {
      this.$emit('scroll', { e });
      if (typeof (this as any).onScroll === 'function') {
        (this as any).onScroll({ e });
      }
      (this as any).checkAutoScroll();
      (this as any).checkAndShowScrollButton();
    },
    checkAutoScroll: throttle(function(this: any) {
      const list = this.$refs.listRef as HTMLDivElement;
      if (!list || this.reverse) return;
      const { scrollTop, scrollHeight, clientHeight } = list;
      const { defaultScrollTo } = this.$props;

      const scrollDiff = this.scrollTopTmp - scrollTop;
      const upScroll = scrollHeight === this.scrollHeightTmp && scrollDiff >= 10 ? true : false;

      if (upScroll) {
        this.isAutoScrollEnabled = false;
        this.preventAutoScroll = true;
      } else {
        const threshold = 50;
        let isNearTarget = false;

        if (defaultScrollTo === 'top') {
          isNearTarget = scrollTop <= threshold;
        } else {
          isNearTarget = scrollHeight - (scrollTop + clientHeight) <= threshold;
        }

        if (this.preventAutoScroll) {
          if (isNearTarget) {
            this.isAutoScrollEnabled = true;
            this.preventAutoScroll = false;
          }
        } else {
          this.isAutoScrollEnabled = true;
        }
      }
      this.scrollTopTmp = scrollTop;
    }, 60),
    checkAndShowScrollButton: debounce(function(this: any) {
      if (!this.showScrollButton) {
        this.scrollButtonVisible = false;
        return;
      }
      const list = this.$refs.listRef as HTMLDivElement;
      if (!list) return;
      if (!this.reverse) {
        if (list.scrollHeight - list.clientHeight - list.scrollTop > 0) {
          this.scrollButtonVisible = true;
        } else {
          this.scrollButtonVisible = false;
        }
      } else {
        this.scrollButtonVisible = list.scrollTop < 0;
      }
    }, 70),
    handleAutoScroll: throttle(function(this: any) {
      const { autoScroll, reverse } = this.$props;
      if (!autoScroll || !this.isAutoScrollEnabled || reverse) {
        return;
      }

      const list = this.$refs.listRef as HTMLDivElement;
      if (!list) return;

      const { defaultScrollTo } = this.$props;
      if (defaultScrollTo === 'top') {
        list.scrollTo({
          top: 0,
          behavior: 'auto',
        });
      } else {
        this.scrollToBottom({ behavior: 'auto' });
      }
    }, 50),
    backBottom() {
      this.scrollToBottom({ behavior: 'smooth' });
    },
  },
});
</script>

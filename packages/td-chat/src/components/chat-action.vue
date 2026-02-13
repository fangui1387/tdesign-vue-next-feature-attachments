<template>
  <div :class="`${COMPONENT_NAME}__actions`">
    <t-space>
      <template v-for="btnKey in operationBtn">
        <!-- 重新生成按钮 -->
        <div v-if="btnKey === 'replay'" :key="btnKey" :class="`${COMPONENT_NAME}__refresh`">
          <t-tooltip :content="refreshTipText">
            <t-button theme="default" size="small" :disabled="disabled" @click="handleClick($event, 'replay')">
              <t-icon-refresh />
            </t-button>
          </t-tooltip>
          <span :class="`${COMPONENT_NAME}__refresh-line`"></span>
        </div>

        <!-- 复制按钮 -->
        <t-tooltip v-if="btnKey === 'copy'" :key="btnKey" :content="copyTipText">
          <t-button
            theme="default"
            size="small"
            class="copy-btn"
            :disabled="disabled"
            @click="handleClick($event, 'copy')"
            :data-clipboard-text="contentValue"
          >
            <t-icon-copy />
          </t-button>
        </t-tooltip>

        <!-- 点赞按钮 -->
        <t-tooltip v-if="btnKey === 'good'" :key="btnKey" :content="likeTipText">
          <t-button
            theme="default"
            size="small"
            :class="isGood && `${COMPONENT_NAME}-button--active`"
            :disabled="disabled"
            @click="handleClick($event, 'good')"
          >
            <t-icon-thumb-up v-if="isGood" />
            <t-icon-thumb-up v-else />
          </t-button>
        </t-tooltip>

        <!-- 点踩按钮 -->
        <t-tooltip v-if="btnKey === 'bad'" :key="btnKey" :content="dislikeTipText">
          <t-button
            theme="default"
            size="small"
            :class="isBad && `${COMPONENT_NAME}-button--active`"
            :disabled="disabled"
            @click="handleClick($event, 'bad')"
          >
            <t-icon-thumb-down v-if="isBad" />
            <t-icon-thumb-down v-else />
          </t-button>
        </t-tooltip>
      </template>
    </t-space>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Button as TButton, Tooltip as TTooltip, Space as TSpace } from 'tdesign-vue';
import {
  ThumbUpIcon as TIconThumbUp,
  ThumbDownIcon as TIconThumbDown,
  RefreshIcon as TIconRefresh,
  CopyIcon as TIconCopy,
} from 'tdesign-icons-vue';
import Clipboard from 'clipboard';
import props from '../props/chat-action';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useConfig } from '../composables/useConfig';
import { useTNodeJSX } from '../composables/useTNodeJSX';
import { MessagePluginSingleton } from '../utils';

export default Vue.extend({
  name: 'TChatAction',
  components: {
    TButton,
    TTooltip,
    TSpace,
    TIconThumbUp,
    TIconThumbDown,
    TIconRefresh,
    TIconCopy,
  },
  props,
  data() {
    return {
      clipboard: null as any,
    };
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    globalConfig(): any {
      return useConfig('chat').globalConfig;
    },
    copyTipText(): string {
      return (this as any).globalConfig.copyTipText;
    },
    likeTipText(): string {
      return (this as any).globalConfig.likeTipText;
    },
    dislikeTipText(): string {
      return (this as any).globalConfig.dislikeTipText;
    },
    refreshTipText(): string {
      return (this as any).globalConfig.refreshTipText;
    },
    contentValue(): string {
      const renderTNodeJSX = useTNodeJSX(this);
      const contentNode = renderTNodeJSX('content');
      if (typeof contentNode === 'string') return contentNode;
      return (this as any).content || '';
    },
  },
  mounted() {
    (this as any).initClipboard();
  },
  updated() {
    (this as any).initClipboard();
  },
  beforeDestroy() {
    if ((this as any).clipboard) {
      (this as any).clipboard.destroy();
      (this as any).clipboard = null;
    }
  },
  methods: {
    initClipboard() {
      if ((this as any).clipboard) {
        (this as any).clipboard.destroy();
        (this as any).clipboard = null;
      }
      const root = this.$el as HTMLElement;
      if (!root) return;
      const triggers = Array.from(root.querySelectorAll('.copy-btn'));
      if (triggers.length === 0) return;
      const clipboard = new Clipboard(triggers as any);
      const messagePluginInstance = MessagePluginSingleton.getInstance();
      clipboard.on('success', () => {
        messagePluginInstance.showSuccess((this as any).globalConfig.copyTextSuccess);
      });
      clipboard.on('error', () => {
        messagePluginInstance.showError((this as any).globalConfig.copyTextFail);
      });
      (this as any).clipboard = clipboard;
    },
    handleClick(e: MouseEvent, type: string) {
      this.$emit('operation', type, { e });
      if (typeof (this as any).onOperation === 'function') {
        (this as any).onOperation(type, { e });
      }
    },
  },
});
</script>

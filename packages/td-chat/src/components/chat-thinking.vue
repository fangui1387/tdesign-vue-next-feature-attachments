<template>
  <div :class="classes">
    <div :class="`${COMPONENT_NAME}__header`">
      <span :class="`${COMPONENT_NAME}__icon`">
        <loading-icon v-if="loading" />
        <check-circle-icon v-else />
      </span>
      <span :class="`${COMPONENT_NAME}__title`">{{ title }}</span>
    </div>
    <div :class="`${COMPONENT_NAME}__content`">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LoadingIcon, CheckCircleIcon } from 'tdesign-icons-vue';
import { usePrefixClass } from '../composables/usePrefixClass';

export default Vue.extend({
  name: 'TChatThinking',
  components: {
    LoadingIcon,
    CheckCircleIcon,
  },
  props: {
    /** 是否处于加载状态 */
    loading: {
      type: Boolean,
      default: true,
    },
    /** 标题文本 */
    title: {
      type: String,
      default: '思考中...',
    },
    /** 完成后的标题 */
    completeTitle: {
      type: String,
      default: '思考完成',
    },
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat-thinking', this);
    },
    classes(): any[] {
      return [
        (this as any).COMPONENT_NAME,
        {
          [`${(this as any).COMPONENT_NAME}--loading`]: (this as any).loading,
        },
      ];
    },
    displayTitle(): string {
      return (this as any).loading ? (this as any).title : (this as any).completeTitle;
    },
  },
});
</script>

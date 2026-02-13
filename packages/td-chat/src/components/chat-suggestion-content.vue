<template>
  <div :class="COMPONENT_NAME">
    <div :class="`${COMPONENT_NAME}__header`">
      <lightbulb-icon />
      <span>{{ title }}</span>
    </div>
    <div :class="`${COMPONENT_NAME}__items`">
      <div
        v-for="(item, index) in suggestionItems"
        :key="index"
        :class="`${COMPONENT_NAME}__item`"
        @click="handleClick(item, index)"
      >
        {{ typeof item === 'string' ? item : item.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LightbulbIcon } from 'tdesign-icons-vue';
import { usePrefixClass } from '../composables/usePrefixClass';

export interface SuggestionItem {
  text: string;
  value?: string;
  [key: string]: any;
}

export default Vue.extend({
  name: 'TChatSuggestionContent',
  components: {
    LightbulbIcon,
  },
  props: {
    /** 建议标题 */
    title: {
      type: String,
      default: '建议',
    },
    /** 建议项目列表 */
    items: {
      type: Array as () => (string | SuggestionItem)[],
      default: () => [],
    },
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat-suggestion-content', this);
    },
    suggestionItems(): (string | SuggestionItem)[] {
      return (this as any).items || [];
    },
  },
  methods: {
    handleClick(item: string | SuggestionItem, index: number) {
      this.$emit('click', item, index);
    },
  },
});
</script>

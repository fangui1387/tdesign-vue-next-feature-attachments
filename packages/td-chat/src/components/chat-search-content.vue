<template>
  <div :class="COMPONENT_NAME">
    <div :class="`${COMPONENT_NAME}__header`">
      <search-icon />
      <span>{{ title }}</span>
    </div>
    <div :class="`${COMPONENT_NAME}__items`">
      <div
        v-for="(item, index) in searchItems"
        :key="index"
        :class="`${COMPONENT_NAME}__item`"
        @click="handleClick(item, index)"
      >
        <div :class="`${COMPONENT_NAME}__item-title`">{{ item.title }}</div>
        <div :class="`${COMPONENT_NAME}__item-desc`">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SearchIcon } from 'tdesign-icons-vue';
import { usePrefixClass } from '../composables/usePrefixClass';

export interface SearchItem {
  title: string;
  description?: string;
  url?: string;
  [key: string]: any;
}

export default Vue.extend({
  name: 'TChatSearchContent',
  components: {
    SearchIcon,
  },
  props: {
    /** 搜索标题 */
    title: {
      type: String,
      default: '搜索结果',
    },
    /** 搜索项目列表 */
    items: {
      type: Array as () => SearchItem[],
      default: () => [],
    },
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat-search-content', this);
    },
    searchItems(): SearchItem[] {
      return (this as any).items || [];
    },
  },
  methods: {
    handleClick(item: SearchItem, index: number) {
      this.$emit('click', item, index);
    },
  },
});
</script>

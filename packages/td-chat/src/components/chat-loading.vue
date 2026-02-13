<template>
  <div :class="componentName">
    <div v-if="animation === 'moving'" :class="[`${componentName}__indicator`, `${componentName}__indicator--moving`]">
      <div :class="[`${componentName}__dot`, `${componentName}__dot--top`]"></div>
      <div :class="[`${componentName}__dot`, `${componentName}__dot--left`]"></div>
      <div :class="[`${componentName}__dot`, `${componentName}__dot--right`]"></div>
    </div>
    <div v-else :class="[`${componentName}__indicator`, `${componentName}__indicator--gradient`]"></div>
    <div :class="`${componentName}__text`">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import props from '../props/chat-loading';
import { usePrefixClass } from '../composables/usePrefixClass';

export default Vue.extend({
  name: 'TChatLoading',
  props,
  computed: {
    componentName(): string {
      return usePrefixClass('chat-loading', this);
    },
  },
});
</script>

<template>
  <div :class="COMPONENT_NAME">
    <div
      v-for="(toolCall, index) in toolCalls"
      :key="toolCall.id || index"
      :class="`${COMPONENT_NAME}__item`"
    >
      <div :class="`${COMPONENT_NAME}__header`">
        <tools-icon />
        <span>{{ getToolCallName(toolCall) }}</span>
        <span :class="`${COMPONENT_NAME}__status--${getToolCallStatus(toolCall)}`">
          {{ getToolCallStatus(toolCall) }}
        </span>
      </div>
      <div :class="`${COMPONENT_NAME}__content`">
        <pre v-if="hasArguments(toolCall)">{{ formatArguments(toolCall.function.arguments) }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ToolsIcon } from 'tdesign-icons-vue';
import { usePrefixClass } from '../composables/usePrefixClass';
import { ToolCall } from '../types';

export default Vue.extend({
  name: 'TToolCallRenderer',
  components: {
    ToolsIcon,
  },
  props: {
    /** Tool calls 列表 */
    toolCalls: {
      type: Array as () => ToolCall[],
      default: () => [],
    },
    /** Tool call 结果映射 */
    results: {
      type: Object as () => Record<string, any>,
      default: () => ({}),
    },
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('toolcall-renderer', this);
    },
  },
  methods: {
    getToolCallName(toolCall: ToolCall): string {
      return (toolCall.function && toolCall.function.name) || 'Tool Call';
    },
    hasArguments(toolCall: ToolCall): boolean {
      return !!(toolCall.function && toolCall.function.arguments);
    },
    getToolCallStatus(toolCall: ToolCall): string {
      const results = (this as any).results;
      const result = results && results[toolCall.id];
      if (result === undefined) return 'pending';
      if (result.error) return 'error';
      return 'complete';
    },
    formatArguments(args: string): string {
      try {
        const parsed = JSON.parse(args);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return args;
      }
    },
  },
});
</script>

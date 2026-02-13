<template>
  <div :class="classes" :style="styles">
    <div
      v-for="(item, index) in items"
      :key="item.uid || index"
      :class="`${COMPONENT_NAME}__item`"
    >
      <div :class="`${COMPONENT_NAME}__item-content`">
        <t-icon-file v-if="!item.url" />
        <img v-else :src="item.url" :alt="item.name" />
        <span :class="`${COMPONENT_NAME}__item-name`">{{ item.name }}</span>
        <t-icon-close
          :class="`${COMPONENT_NAME}__item-close`"
          @click="handleRemove(item, index)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FileIcon as TIconFile, CloseIcon as TIconClose } from 'tdesign-icons-vue';
import { usePrefixClass } from '../composables/usePrefixClass';

export interface AttachmentItem {
  uid?: string;
  name: string;
  url?: string;
  size?: number;
  type?: string;
  status?: 'success' | 'error' | 'pending';
}

export default Vue.extend({
  name: 'TAttachments',
  components: {
    TIconFile,
    TIconClose,
  },
  props: {
    /** 附件列表 */
    items: {
      type: Array as () => AttachmentItem[],
      default: () => [],
    },
    /** 溢出布局方式 */
    overflow: {
      type: String as () => 'scrollX' | 'scrollY' | 'wrap',
      default: 'scrollX',
    },
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('attachments', this);
    },
    classes(): any[] {
      return [
        (this as any).COMPONENT_NAME,
        `${(this as any).COMPONENT_NAME}--${(this as any).overflow}`,
      ];
    },
    styles(): Record<string, string> {
      const overflow = (this as any).overflow;
      if (overflow === 'scrollX') {
        return {
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
        };
      }
      if (overflow === 'scrollY') {
        return {
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          overflowY: 'auto',
        };
      }
      return {
        display: 'flex',
        flexWrap: 'wrap',
      };
    },
  },
  methods: {
    handleRemove(item: AttachmentItem, index: number) {
      this.$emit('remove', item, index);
    },
  },
});
</script>

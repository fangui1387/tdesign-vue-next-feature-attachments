<template>
  <div :class="messageClasses">
    <chat-item
      :avatar="avatar"
      :name="name"
      :role="role"
      :datetime="datetime"
      :content="content"
      :reasoning="reasoning"
      :reasoning-loading="reasoningLoading"
      :text-loading="textLoading"
      :animation="animation"
      :variant="variant"
      :status="status"
      :placement="placement"
    >
      <template #actions>
        <slot name="actionbar" />
        <slot name="actions" />
      </template>
      <template #name>
        <slot name="name" />
      </template>
      <template #avatar>
        <slot name="avatar" />
      </template>
      <template #datetime>
        <slot name="datetime" />
      </template>
      <template #content>
        <slot name="content" />
      </template>
    </chat-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import props from '../props/chat-message';
import { usePrefixClass } from '../composables/usePrefixClass';
import ChatItem from './chat-item.vue';

export default Vue.extend({
  name: 'TChatMessage',
  components: {
    ChatItem,
  },
  props,
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    messageClasses(): any[] {
      return [
        `${(this as any).COMPONENT_NAME}__message`,
        `${(this as any).COMPONENT_NAME}__message--${(this as any).placement || 'left'}`,
      ];
    },
  },
});
</script>

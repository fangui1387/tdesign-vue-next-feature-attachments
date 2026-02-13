<template>
  <div :class="`${COMPONENT_NAME}__markdown`" v-html="renderedContent"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { marked } from 'marked';
import { highlightElement } from '../utils/highlight';
import { usePrefixClass } from '../composables/usePrefixClass';

export default Vue.extend({
  name: 'TChatMarkdown',
  props: {
    content: {
      type: String,
      default: '',
    },
    highlight: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    renderedContent(): string {
      if (!this.content) return '';
      try {
        const html = marked.parse(this.content, { async: false }) as string;
        return html;
      } catch (e) {
        console.error('Markdown parse error:', e);
        return this.content;
      }
    },
  },
  mounted() {
    if (this.highlight) {
      this.highlightCode();
    }
  },
  updated() {
    if (this.highlight) {
      this.highlightCode();
    }
  },
  methods: {
    highlightCode() {
      const el = this.$el as HTMLElement;
      if (!el) return;
      const codeBlocks = el.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        highlightElement(block as HTMLElement);
      });
    },
  },
});
</script>

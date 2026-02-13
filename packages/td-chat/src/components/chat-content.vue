<template>
  <div :class="`${COMPONENT_NAME}__text`">
    <div v-if="role === 'user'" :class="`${COMPONENT_NAME}__text--${role}`">
      <pre v-html="textInfo"></pre>
    </div>
    <div v-else :class="`${COMPONENT_NAME}__text__assistant`">
      <div 
        :class="[`${COMPONENT_NAME}__text__content`, `${COMPONENT_NAME}__text--${role}`]" 
        v-html="textInfo"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Clipboard from 'clipboard';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import props from '../props/chat-content';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useConfig } from '../composables/useConfig';

const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
type IEscape = {
  [key in '&<>"\'']: string;
};
const escapeReplacements: IEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const getEscapeReplacement = (ch: string): string => escapeReplacements[ch as keyof IEscape];

function escape(html: string, encode: Boolean = false) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else if (escapeTestNoEncode.test(html)) {
    return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
  }
  return html;
}

export default Vue.extend({
  name: 'TChatContent',
  props,
  inject: {
    getRole: { default: null },
  },
  data() {
    return {
      clipboard: null as any,
      markedInstance: null as any,
    };
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    globalConfig(): any {
      return useConfig('chat').globalConfig;
    },
    role(): string {
      const injected = typeof (this as any).getRole === 'function' ? (this as any).getRole() : '';
      return (this as any).$props.role || injected || '';
    },
    textInfo(): string {
      const role = (this as any).role;
      const content = (this as any).$props.content;
      if (role === 'model-change') return content || '';
      if (role === 'user' && typeof content === 'string') return escape(content);
      return (this as any).getHtmlByMarked(content || '');
    },
  },
  created() {
    const globalConfig = (this as any).globalConfig;
    const marked = new Marked(
      markedHighlight({
        highlight(code) {
          return hljs.highlightAuto(code).value;
        },
      }),
      {
        renderer: {
          code(code, lang, escaped) {
            return `<pre class="hljs"><div class="t-chat__code-header">
        <span class="t-chat__language-txt">${escape(lang || '')}</span>
        <div class="t-chat__copy-btn" data-clipboard-action="copy">${globalConfig.copyCodeBtnText}</div>
        </div><code class="hljs language-${escape(lang || '')}" >${escaped ? code : escape(code)}</code></pre>`;
          },
        },
      },
    );
    (this as any).markedInstance = marked;
  },
  mounted() {
    const clipboard = new Clipboard(`.${(this as any).COMPONENT_NAME}__copy-btn`, {
      target: (trigger: HTMLDivElement) => (trigger.parentNode as HTMLElement).nextElementSibling as Element,
    });
    clipboard.on('success', (e) => {
      e.trigger.textContent = (this as any).globalConfig.copyCodeSuccessText;
      setTimeout(() => {
        e.trigger.textContent = (this as any).globalConfig.copyCodeBtnText;
      }, 2000);
      e.clearSelection();
    });
    (this as any).clipboard = clipboard;
  },
  beforeDestroy() {
    if ((this as any).clipboard) {
      (this as any).clipboard.destroy();
      (this as any).clipboard = null;
    }
  },
  methods: {
    getHtmlByMarked(markdown: string) {
      if (!markdown) return '<div class=\"waiting\"></div>';
      const marked: any = (this as any).markedInstance;
      return marked.parse(markdown) as string;
    },
  },
});
</script>

<script lang="ts">
import { CreateElement, RenderContext, VNode } from 'vue';

export default {
  name: 'TNode',
  functional: true,
  props: {
    content: {
      type: [String, Object, Array, Function],
      default: undefined,
    },
  },
  render(h: CreateElement, context: RenderContext): VNode | VNode[] | string {
    const { content } = context.props;
    let renderContent = content;

    if (typeof content === 'function') {
      renderContent = content(h);
    }

    if (renderContent && typeof renderContent === 'object') {
      const isVNode = (obj: any) => obj && (obj.componentOptions || obj.tag || obj.isComment || obj.isRootInsert || obj.isStatic || obj.key !== undefined || obj.text !== undefined);
      
      if (Array.isArray(renderContent)) {
        if (renderContent.length === 0) return null;
        
        if (!isVNode(renderContent[0]) && typeof renderContent[0] !== 'string') {
          return null;
        }

        if (renderContent.length === 1) {
          return renderContent[0];
        } else {
          return h('div', { style: { display: 'contents' } }, renderContent);
        }
      } else if (!isVNode(renderContent)) {
         return null;
      }
    }

    return renderContent as VNode | VNode[] | string;
  },
};
</script>

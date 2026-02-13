<template>
  <div :class="`${COMPONENT_NAME}__detail-reasoning`">
    <t-collapse
      :borderless="true"
      :expand-icon-placement="expandIconPlacement"
      :value="innerCollapsed ? [] : [0]"
      @change="onChangeFn"
    >
      <t-collapse-panel :expand-icon="true" :value="0">
        <template #header>
          <t-node :content="headerContent" />
        </template>
        <template #headerRightContent>
          <t-node :content="headerRightContentValue" />
        </template>
        <template #expandIcon>
          <t-node :content="expandIconValue" />
        </template>
        <template #default>
          <t-node :content="contentValue" />
        </template>
      </t-collapse-panel>
    </t-collapse>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Collapse as TCollapse, CollapsePanel as TCollapsePanel } from 'tdesign-vue';
import props from '../props/chat-reasoning';
import { usePrefixClass } from '../composables/usePrefixClass';
import { useTNodeJSX } from '../composables/useTNodeJSX';
import TNode from './TNode.vue';

export default Vue.extend({
  name: 'TChatReasoning',
  components: {
    TCollapse,
    TCollapsePanel,
    TNode,
  },
  props,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  inject: {
    getRole: { default: null },
  },
  data() {
    const initial =
      this.modelValue !== undefined ? this.modelValue : this.collapsed !== undefined ? this.collapsed : this.defaultCollapsed;
    return {
      innerCollapsed: !!initial,
    };
  },
  computed: {
    COMPONENT_NAME(): string {
      return usePrefixClass('chat', this);
    },
    role(): string {
      return typeof (this as any).getRole === 'function' ? (this as any).getRole() : '';
    },
    headerContent(): any {
      const renderTNodeJSX = useTNodeJSX(this);
      return (this.collapsePanelProps as any)?.header || renderTNodeJSX('header');
    },
    headerRightContentValue(): any {
      const renderTNodeJSX = useTNodeJSX(this);
      return (this.collapsePanelProps as any)?.headerRightContent || renderTNodeJSX('headerRightContent');
    },
    expandIconValue(): any {
      const renderTNodeJSX = useTNodeJSX(this);
      return (this.collapsePanelProps as any)?.expandIcon || renderTNodeJSX('expandIcon');
    },
    contentValue(): any {
      const renderTNodeJSX = useTNodeJSX(this);
      return (this.collapsePanelProps as any)?.content || renderTNodeJSX('default');
    },
  },
  watch: {
    collapsed(val: boolean) {
      if (val !== undefined) (this as any).innerCollapsed = val;
    },
    modelValue(val: boolean) {
      if (val !== undefined) (this as any).innerCollapsed = val;
    },
  },
  methods: {
    setInnerCollapsed(collapsed: boolean) {
      (this as any).innerCollapsed = collapsed;
      this.$emit('update:collapsed', collapsed);
      this.$emit('expand-change', !collapsed);
      this.$emit('update:modelValue', collapsed);
      if (typeof (this as any).onExpandChange === 'function') {
        (this as any).onExpandChange(!collapsed);
      }
    },
    onChangeFn(value: Array<number>) {
      this.setInnerCollapsed(value.length === 0);
    },
  },
});
</script>

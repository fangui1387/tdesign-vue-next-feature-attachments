import { isFunction } from 'lodash-es';

export interface RenderTNodeJSXOptions {
  params?: Record<string, any>;
  slotFirst?: boolean;
  defaultNode?: any;
}

export function useTNodeJSX(vm: any) {
  return (name: string, options: RenderTNodeJSXOptions = {}) => {
    const { params = {}, slotFirst = false, defaultNode } = options;

    const scopedSlots = vm?.$scopedSlots || {};
    const normalSlots = vm?.$slots || {};
    const props = vm?.$props || {};

    const getSlotContent = () => {
      if (scopedSlots[name]) return scopedSlots[name](params);
      if (normalSlots[name]) return normalSlots[name];
      return undefined;
    };

    if (slotFirst) {
      const slotContent = getSlotContent();
      if (slotContent !== undefined) return slotContent;
    }

    const propValue = props[name];
    if (propValue !== undefined) {
      if (isFunction(propValue)) {
        return propValue(vm.$createElement, params);
      }
      return propValue;
    }

    const slotContent = getSlotContent();
    if (slotContent !== undefined) return slotContent;

    if (defaultNode !== undefined) return defaultNode;

    return undefined;
  };
}

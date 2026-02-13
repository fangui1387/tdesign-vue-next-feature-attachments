export function getVModelValue<T>(props: any, defaultValue: T) {
  if (props?.modelValue !== undefined) return props.modelValue as T;
  if (props?.value !== undefined) return props.value as T;
  return defaultValue;
}

export function emitVModel<T>(
  vm: any,
  value: T,
  options: {
    propName?: string;
    onChange?: (val: T, ...args: any[]) => void;
    args?: any[];
  } = {},
) {
  const propName = options.propName || 'value';
  const args = options.args || [];
  if (!vm) return;

  if (propName === 'value') {
    vm.$emit('input', value, ...args);
  }
  vm.$emit(`update:${propName}`, value, ...args);
  if (typeof options.onChange === 'function') {
    options.onChange(value, ...args);
  }
}

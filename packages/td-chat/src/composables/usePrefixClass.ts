export function usePrefixClass(componentName?: string, vm?: any) {
  const globalPrefix = vm?.$TDESIGN?.prefix || 't';
  return componentName ? `${globalPrefix}-${componentName}` : globalPrefix;
}

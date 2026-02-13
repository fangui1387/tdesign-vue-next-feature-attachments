# Changelog

## 1.0.0

### Features

- **Components**: Ported all Chat components from `tdesign-vue-next` (Vue 3) to `td-chat` (Vue 2.7).
  - `TChat`, `TChatItem`, `TChatInput`, `TChatContent`, `TChatAction`, `TChatSender`, `TChatLoading`, `TChatReasoning`.
- **Composables**:
  - `useVModel`: Added for v-model compatibility.
  - `useTNodeJSX`: Added for TNode rendering support.
  - `useConfig`: Added for global configuration.
- **Infrastructure**:
  - Build system using Rollup + rollup-plugin-vue (v5).
  - TypeScript support.
  - pnpm workspace compatibility.

### Improvements

- **Vue 2.7 Compatibility**:
  - Full Composition API support.
  - Scoped slots and Render Function compatibility via `useTNodeJSX`.
  - Icon replacement for Vue 2 version of `tdesign-icons-vue` (filled -> outline where missing).

### Known Issues

- **Style Dependency**: The package relies on `@tdesign/common-style`. Ensure this package is available in your project or configured via aliases.
- **Build**: Requires `pnpm` and explicit `vue-template-compiler` version resolution in monorepo environments (handled via `rollup.config.js` hack).
- **Testing**: Unit tests environment setup is pending due to monorepo dependency resolution issues.

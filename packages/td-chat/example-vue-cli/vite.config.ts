import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Mock common-style less files to pass build
      '@tdesign/common-style/web/components/chat/_index.less': path.resolve(__dirname, 'src/mock-style.less'),
      '@tdesign/common-style/web/components/chat/atom-one-dark.less': path.resolve(__dirname, 'src/mock-style.less'),
    },
  },
});

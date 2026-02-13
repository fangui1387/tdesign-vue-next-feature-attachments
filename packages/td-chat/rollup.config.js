const Module = require('module');
const path = require('path');

// [HACK] Force `require('vue')` to load local Vue 2.7 instead of root Vue 3
// This is necessary because rollup-plugin-vue (and vue-template-compiler) 
// checks for version mismatch and might resolve to the wrong Vue version in a pnpm workspace.
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'vue') {
    try {
      // Try to resolve vue from local node_modules
      const localVuePath = require.resolve('vue', { paths: [path.resolve(__dirname, 'node_modules')] });
      return originalRequire.call(this, localVuePath);
    } catch (e) {
      // Fallback to default behavior if local vue not found
    }
  }
  return originalRequire.apply(this, arguments);
};

const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const { terser } = require('rollup-plugin-terser');
const vue = require('rollup-plugin-vue');

const format =
  process.env.ROLLUP_FORMAT || process.argv.includes('--format')
    ? process.argv[process.argv.indexOf('--format') + 1]
    : 'es';
const isUmd = format === 'umd';
const isCjs = format === 'cjs';
const isEs = format === 'es';

const outputDir = isUmd ? 'dist' : isCjs ? 'lib' : 'es';

module.exports = {
  input: 'src/index.ts',
  external: isUmd
    ? ['vue', 'tdesign-vue', 'tdesign-icons-vue']
    : [
        'vue',
        'tdesign-vue',
        'tdesign-icons-vue',
        'lodash-es',
        'clipboard',
        'marked',
        'marked-highlight',
        'highlight.js',
      ],
  output: {
    dir: outputDir,
    format: format,
    name: isUmd ? 'TDesignVueChat' : undefined,
    globals: isUmd
      ? {
          vue: 'Vue',
          'tdesign-vue': 'TDesignVue',
          'tdesign-icons-vue': 'TDesignIconsVue',
        }
      : undefined,
    exports: 'named',
  },
  plugins: [
    resolve({
      preferBuiltins: false,
      extensions: ['.js', '.ts', '.vue'],
    }),
    commonjs(),
    vue(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
      check: false,
    }),
    isUmd && terser(),
  ].filter(Boolean),
};

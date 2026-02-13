import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const targets = [
  path.join(projectRoot, 'src'),
  path.join(projectRoot, 'lib'),
];

const exts = new Set(['.vue', '.js', '.ts', '.tsx', '.mjs', '.cjs']);

const rules = [
  { id: 'script-setup', re: /<script\s+setup\b/i, feature: '<script setup>', suggestion: '改为 Vue2 Options API：export default { data, computed, methods, ... }' },
  { id: 'define-component', re: /\bdefineComponent\s*\(/, feature: 'defineComponent', suggestion: '改为 export default { ... } 或 Vue.extend({ ... })' },
  { id: 'setup-fn', re: /\bsetup\s*\(/, feature: 'setup() / Composition API', suggestion: '改为 Options API：data/computed/methods/watch + 生命周期钩子' },
  { id: 'vue-ref', re: /\bref\s*\(/, feature: 'ref()', suggestion: '改为 data() 字段或 this.$refs（DOM 引用）' },
  { id: 'vue-reactive', re: /\breactive\s*\(/, feature: 'reactive()', suggestion: '改为 data() 返回对象；复杂场景可用 Vue.observable' },
  { id: 'vue-computed', re: /\bcomputed\s*\(/, feature: 'computed() (Composition API)', suggestion: '改为 computed: { ... } 选项' },
  { id: 'vue-watch', re: /\bwatch\s*\(/, feature: 'watch() (Composition API)', suggestion: '改为 watch: { ... } 选项' },
  { id: 'lifecycle-onmounted', re: /\bonMounted\s*\(/, feature: 'onMounted()', suggestion: '改为 mounted() 生命周期' },
  { id: 'lifecycle-onbeforeunmount', re: /\bonBeforeUnmount\s*\(/, feature: 'onBeforeUnmount()', suggestion: '改为 beforeDestroy() 生命周期' },
  { id: 'get-current-instance', re: /\bgetCurrentInstance\s*\(/, feature: 'getCurrentInstance()', suggestion: '改为 this（组件实例）或在工具函数中显式传入 vm' },
  { id: 'emits-option', re: /^\s*emits\s*:/m, feature: 'emits 选项', suggestion: '删除 emits，使用 this.$emit(...) 触发事件' },
  { id: 'create-app', re: /\bcreateApp\s*\(/, feature: 'createApp()', suggestion: '改为 new Vue({ render })' },
  { id: 'teleport', re: /\bTeleport\b/, feature: 'Teleport', suggestion: 'Vue2 不支持，需改为 Portal/Popper 类方案或重构' },
  { id: 'suspense', re: /\bSuspense\b/, feature: 'Suspense', suggestion: 'Vue2 不支持，需移除或改为加载占位逻辑' },
  { id: 'vmodel-arg', re: /v-model:/, feature: 'v-model 参数化', suggestion: '改为 v-model=\"value\" 或 prop+input 事件' },
  { id: 'v-memo', re: /\bv-memo\b/, feature: 'v-memo', suggestion: 'Vue2 不支持，移除' },
  { id: 'v-is', re: /\bv-is\b/, feature: 'v-is', suggestion: 'Vue2 不支持，改为 <component :is=\"...\">' },
];

function isTextFile(filePath) {
  const ext = path.extname(filePath);
  if (!exts.has(ext)) return false;
  if (filePath.endsWith('.d.ts')) return false;
  return true;
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile() && isTextFile(p)) out.push(p);
  }
  return out;
}

function readLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split(/\r?\n/);
}

function scanFile(filePath) {
  const lines = readLines(filePath);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of rules) {
      if (rule.re.test(line)) {
        hits.push({
          ruleId: rule.id,
          feature: rule.feature,
          suggestion: rule.suggestion,
          line: i + 1,
          excerpt: line.trim().slice(0, 220),
        });
      }
    }
  }
  for (const rule of rules) {
    if (!rule.re.multiline) continue;
    const fileText = lines.join('\n');
    if (rule.re.test(fileText)) {
      hits.push({
        ruleId: rule.id,
        feature: rule.feature,
        suggestion: rule.suggestion,
        line: 1,
        excerpt: '[multi-line-match]',
      });
    }
  }
  return hits;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function main() {
  const files = targets.flatMap((t) => walk(t));
  const report = [];
  for (const file of files) {
    const hits = scanFile(file);
    if (hits.length) {
      report.push({
        file: toPosix(path.relative(projectRoot, file)),
        absFile: toPosix(file),
        hits,
      });
    }
  }

  const jsonPath = path.join(projectRoot, 'compat-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));

  const mdPath = path.join(projectRoot, 'COMPAT_REPORT.md');
  const md = [];
  md.push('# Vue 2.7.16 Compatibility Report');
  md.push('');
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push('');
  if (report.length === 0) {
    md.push('- No violations found.');
  } else {
    md.push(`- Files with violations: ${report.length}`);
    md.push('');
    for (const item of report) {
      md.push(`## ${item.file}`);
      md.push('');
      for (const h of item.hits) {
        md.push(`- L${h.line}: ${h.feature} (${h.ruleId})`);
        if (h.excerpt) md.push(`  - ${h.excerpt}`);
        md.push(`  - Suggestion: ${h.suggestion}`);
      }
      md.push('');
    }
  }
  fs.writeFileSync(mdPath, md.join('\n'));

  if (report.length) {
    process.stderr.write(`Vue2 compatibility violations found. See ${mdPath}\\n`);
    process.exit(1);
  }
  process.stdout.write(`OK. See ${mdPath}\\n`);
}

main();


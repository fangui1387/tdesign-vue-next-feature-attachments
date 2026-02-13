import hljs from 'highlight.js';

export function highlightElement(element: HTMLElement): void {
  if (!element) return;
  
  // 检查是否已经高亮过
  if (element.classList.contains('hljs')) return;
  
  // 获取语言
  const className = element.className || '';
  const langMatch = className.match(/language-(\w+)/);
  const lang = langMatch ? langMatch[1] : '';
  
  try {
    if (lang && hljs.getLanguage(lang)) {
      const result = hljs.highlight(element.textContent || '', { language: lang });
      element.innerHTML = result.value;
    } else {
      const result = hljs.highlightAuto(element.textContent || '');
      element.innerHTML = result.value;
    }
    element.classList.add('hljs');
  } catch (e) {
    console.warn('Highlight error:', e);
  }
}

export function highlightCode(code: string, language?: string): string {
  try {
    if (language && hljs.getLanguage(language)) {
      const result = hljs.highlight(code, { language });
      return result.value;
    } else {
      const result = hljs.highlightAuto(code);
      return result.value;
    }
  } catch (e) {
    console.warn('Highlight code error:', e);
    return code;
  }
}

import Vue from 'vue';
import TDesign from 'tdesign-vue';
import { config } from '@vue/test-utils';

Vue.use(TDesign);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock fetch
global.fetch = jest.fn();

// Mock AbortController
global.AbortController = class AbortController {
  signal = { aborted: false };
  abort() {
    this.signal.aborted = true;
  }
};

// Mock clipboard
global.Clipboard = class Clipboard {
  constructor() {}
  on() {}
  destroy() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Element.prototype.scrollTo and scrollBy
Object.defineProperty(Element.prototype, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});
Object.defineProperty(Element.prototype, 'scrollBy', {
  writable: true,
  value: jest.fn(),
});

// Configure Vue Test Utils
config.stubs = {
  't-icon': true,
  't-button': true,
  't-textarea': true,
  't-skeleton': true,
  't-divider': true,
  't-popconfirm': true,
  't-tooltip': true,
  't-space': true,
  't-collapse-panel': true,
};

import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import ChatItem from '@/components/chat-item.vue';

const localVue = createLocalVue();

describe('ChatItem Component', () => {
  let wrapper: Wrapper<Vue>;

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Hello',
        },
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.t-chat__inner').exists()).toBe(true);
    });

    it('renders with user role', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'user',
          content: 'User message',
        },
      });
      expect(wrapper.find('.user').exists()).toBe(true);
    });

    it('renders with assistant role', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'assistant',
          content: 'Assistant message',
        },
      });
      expect(wrapper.find('.assistant').exists()).toBe(true);
    });

    it('renders with error role', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'error',
          content: 'Error message',
        },
      });
      expect(wrapper.find('.error').exists()).toBe(true);
    });
  });

  describe('Content Rendering', () => {
    it('renders string content', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test content',
        },
      });
      expect(wrapper.text()).toContain('Test content');
    });

    it('renders with textLoading state', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: '',
          textLoading: true,
          animation: 'skeleton',
        },
      });
      expect(wrapper.find('t-skeleton-stub').exists()).toBe(true);
    });

    it('renders with gradient animation', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: '',
          textLoading: true,
          animation: 'gradient',
        },
      });
      expect(wrapper.find('chat-loading-stub').exists()).toBe(true);
    });
  });

  describe('Avatar Rendering', () => {
    it('renders with string avatar', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          avatar: 'https://example.com/avatar.png',
        },
      });
      const img = wrapper.find('img');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/avatar.png');
    });

    it('renders with custom avatar slot', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
        },
        slots: {
          avatar: '<div class="custom-avatar">Avatar</div>',
        },
      });
      expect(wrapper.find('.custom-avatar').exists()).toBe(true);
    });
  });

  describe('Name and Datetime', () => {
    it('renders name', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          name: 'User Name',
        },
      });
      expect(wrapper.find('.t-chat__name').exists()).toBe(true);
      expect(wrapper.text()).toContain('User Name');
    });

    it('renders datetime', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          datetime: '2024-01-01 12:00',
        },
      });
      expect(wrapper.find('.t-chat__time').exists()).toBe(true);
      expect(wrapper.text()).toContain('2024-01-01 12:00');
    });

    it('renders with custom name slot', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
        },
        slots: {
          name: '<span class="custom-name">Custom</span>',
        },
      });
      expect(wrapper.find('.custom-name').exists()).toBe(true);
    });
  });

  describe('Reasoning', () => {
    it('renders with string reasoning', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'assistant',
          content: 'Answer',
          reasoning: 'Thinking process',
        },
      });
      expect(wrapper.find('chat-reasoning-stub').exists()).toBe(true);
    });

    it('renders with object reasoning', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'assistant',
          content: 'Answer',
          reasoning: {
            expandIconPlacement: 'right',
            collapsed: false,
          },
        },
      });
      expect(wrapper.find('chat-reasoning-stub').exists()).toBe(true);
    });

    it('does not render reasoning for user role', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'user',
          content: 'Question',
          reasoning: 'Thinking',
        },
      });
      // Reasoning should not be shown for user role
      const reasoningElements = wrapper.findAll('chat-reasoning-stub');
      expect(reasoningElements.length).toBe(0);
    });
  });

  describe('Actions', () => {
    it('renders with actions slot', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'assistant',
          content: 'Test',
        },
        slots: {
          actions: '<div class="custom-actions">Actions</div>',
        },
      });
      expect(wrapper.find('.custom-actions').exists()).toBe(true);
    });

    it('renders with actionbar slot', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'assistant',
          content: 'Test',
        },
        slots: {
          actionbar: '<div class="custom-actionbar">Actionbar</div>',
        },
      });
      expect(wrapper.find('.custom-actionbar').exists()).toBe(true);
    });
  });

  describe('Variant Styles', () => {
    it('renders with base variant', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          variant: 'base',
        },
      });
      expect(wrapper.find('.t-chat__text--variant--base').exists()).toBe(true);
    });

    it('renders with outline variant', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          variant: 'outline',
        },
      });
      expect(wrapper.find('.t-chat__text--variant--outline').exists()).toBe(true);
    });

    it('renders with text variant', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          variant: 'text',
        },
      });
      expect(wrapper.find('.t-chat__text--variant--text').exists()).toBe(true);
    });
  });

  describe('Status', () => {
    it('renders with error status', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Error message',
          status: 'error',
        },
      });
      expect(wrapper.props('status')).toBe('error');
    });
  });

  describe('Model Change Role', () => {
    it('renders model-change role without avatar', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          role: 'model-change',
          content: 'Model changed',
          avatar: 'https://example.com/avatar.png',
        },
      });
      // Avatar should not be rendered for model-change role
      expect(wrapper.find('.t-chat__avatar').exists()).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('computes isStringAvatar correctly', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          avatar: 'https://example.com/avatar.png',
        },
      });
      expect((wrapper.vm as any).isStringAvatar).toBe(true);
    });

    it('computes isObjectReasoning correctly', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          reasoning: { collapsed: false },
        },
      });
      expect((wrapper.vm as any).isObjectReasoning).toBe(true);
    });

    it('computes isStringReasoning correctly', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test',
          reasoning: 'Thinking',
        },
      });
      expect((wrapper.vm as any).isStringReasoning).toBe(true);
    });

    it('computes isStringContent correctly', () => {
      wrapper = mount(ChatItem, {
        localVue,
        propsData: {
          content: 'Test content',
        },
      });
      expect((wrapper.vm as any).isStringContent).toBe(true);
    });
  });
});

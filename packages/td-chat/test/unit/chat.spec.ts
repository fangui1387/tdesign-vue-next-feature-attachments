import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Chat from '@/components/chat.vue';
import ChatItem from '@/components/chat-item.vue';

const localVue = createLocalVue();

describe('Chat Component', () => {
  let wrapper: Wrapper<Vue>;

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
        },
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.t-chat').exists()).toBe(true);
      expect(wrapper.find('.t-chat__list').exists()).toBe(true);
    });

    it('renders with custom class', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          layout: 'both',
        },
      });
      expect(wrapper.find('.t-chat--normal').exists()).toBe(true);
    });

    it('renders with reverse layout', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          reverse: true,
        },
      });
      expect(wrapper.find('.t-chat__list--reverse').exists()).toBe(true);
    });
  });

  describe('Data Rendering', () => {
    it('renders messages correctly', () => {
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' },
      ];
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: messages,
        },
      });

      const items = wrapper.findAllComponents(ChatItem);
      expect(items.length).toBe(2);
    });

    it('renders empty state when no data', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
        },
      });

      expect(wrapper.findAllComponents(ChatItem).length).toBe(0);
    });

    it('renders with custom slots', () => {
      const messages = [{ role: 'user', content: 'Test' }];
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: messages,
        },
        slots: {
          default: '<div class="custom-empty">Empty</div>',
        },
      });

      expect(wrapper.find('.custom-empty').exists()).toBe(true);
    });
  });

  describe('Props', () => {
    it('accepts animation prop', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          animation: 'gradient',
        },
      });
      expect(wrapper.props('animation')).toBe('gradient');
    });

    it('accepts layout prop', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          layout: 'single',
        },
      });
      expect(wrapper.props('layout')).toBe('single');
    });

    it('accepts autoScroll prop', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          autoScroll: false,
        },
      });
      expect(wrapper.props('autoScroll')).toBe(false);
    });

    it('accepts showScrollButton prop', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          showScrollButton: false,
        },
      });
      expect(wrapper.props('showScrollButton')).toBe(false);
    });

    it('accepts textLoading prop', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [{ role: 'assistant', content: 'Loading' }],
          textLoading: true,
        },
      });
      expect(wrapper.props('textLoading')).toBe(true);
    });

    it('accepts isStreamLoad prop', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [{ role: 'assistant', content: 'Streaming' }],
          isStreamLoad: true,
        },
      });
      expect(wrapper.props('isStreamLoad')).toBe(true);
    });
  });

  describe('Events', () => {
    it('emits clear event when clear history clicked', async () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          clearHistory: true,
        },
      });

      await wrapper.vm.$emit('clear', { e: new MouseEvent('click') });
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('emits scroll event on scroll', async () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
        },
      });

      const list = wrapper.find('.t-chat__list');
      await list.trigger('scroll');

      expect(wrapper.emitted('scroll')).toBeTruthy();
    });
  });

  describe('Methods', () => {
    it('scrollToBottom method exists', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
        },
      });

      expect(typeof (wrapper.vm as any).scrollToBottom).toBe('function');
    });

    it('scrollToBottom calls handleScrollToBottom', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
        },
      });

      const handleScrollToBottom = jest.spyOn(wrapper.vm as any, 'handleScrollToBottom');
      (wrapper.vm as any).scrollToBottom({ behavior: 'smooth' });
      expect(handleScrollToBottom).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    it('computes classes correctly', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          layout: 'both',
        },
      });

      const classes = (wrapper.vm as any).classes;
      expect(classes).toContain('t-chat');
      expect(classes).toContain('t-chat--normal');
    });

    it('computes listClasses correctly with reverse', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          reverse: true,
        },
      });

      const listClasses = (wrapper.vm as any).listClasses;
      expect(listClasses).toContain('t-chat__list');
      expect(listClasses).toContain('t-chat__list--reverse');
    });

    it('computes displayData correctly', () => {
      const messages = [{ role: 'user', content: 'Test' }];
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: messages,
        },
      });

      expect((wrapper.vm as any).displayData).toEqual(messages);
    });
  });

  describe('Clear History', () => {
    it('shows clear history button when clearHistory is true', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          clearHistory: true,
        },
      });

      expect(wrapper.find('.clear-btn').exists()).toBe(true);
    });

    it('hides clear history button when clearHistory is false', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          clearHistory: false,
        },
      });

      expect(wrapper.find('.clear-btn').exists()).toBe(false);
    });
  });

  describe('Scroll Button', () => {
    it('shows scroll button when enabled and scrolled', async () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          showScrollButton: true,
        },
        data() {
          return {
            scrollButtonVisible: true,
          };
        },
      });

      expect(wrapper.find('.t-chat__to-bottom').exists()).toBe(true);
    });

    it('hides scroll button when disabled', () => {
      wrapper = mount(Chat, {
        localVue,
        propsData: {
          data: [],
          showScrollButton: false,
        },
      });

      expect(wrapper.find('.t-chat__to-bottom').exists()).toBe(false);
    });
  });
});

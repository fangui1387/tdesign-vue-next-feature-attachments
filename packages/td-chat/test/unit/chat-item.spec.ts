jest.mock('clipboard', () => {
  return function ClipboardMock() {
    return {
      on: jest.fn(),
      destroy: jest.fn(),
    };
  };
});

import { mount, createLocalVue } from '@vue/test-utils';
import TDesign from 'tdesign-vue';
import ChatItem from '@/components/chat-item.vue';

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatItem', () => {
  it('renders assistant content', () => {
    const wrapper = mount(ChatItem, {
      localVue,
      propsData: {
        role: 'assistant',
        content: 'hello',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('hello');
  });

  it('renders reasoning when provided as string', () => {
    const wrapper = mount(ChatItem, {
      localVue,
      propsData: {
        role: 'assistant',
        content: 'hello',
        reasoning: 'reason',
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});


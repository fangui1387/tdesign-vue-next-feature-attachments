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
import ChatContent from '@/components/chat-content.vue';

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatContent', () => {
  it('renders markdown for assistant', async () => {
    const wrapper = mount(ChatContent, {
      localVue,
      propsData: { content: '# Title', role: 'assistant' },
      provide: {
        getRole: () => 'assistant',
      },
    });
    expect(wrapper.exists()).toBe(true);
    await wrapper.setProps({ content: 'Plain' });
    expect(wrapper.html()).toContain('Plain');
  });
});


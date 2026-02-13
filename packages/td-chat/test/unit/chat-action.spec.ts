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
import ChatAction from '@/components/chat-action.vue';

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatAction', () => {
  it('emits operation on click', async () => {
    const wrapper = mount(ChatAction, {
      localVue,
      propsData: {
        operationBtn: ['copy'],
        content: 'x',
      },
    });
    const btn = wrapper.find('.copy-btn');
    expect(btn.exists()).toBe(true);
    await btn.trigger('click');
    expect(wrapper.emitted('operation')).toBeTruthy();
  });
});


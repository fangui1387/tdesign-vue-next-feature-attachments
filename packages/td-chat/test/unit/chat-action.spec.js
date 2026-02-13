jest.mock('clipboard', () => {
  return function ClipboardMock() {
    return {
      on: jest.fn(),
      destroy: jest.fn(),
    };
  };
});

require('../force-vue2');

const { mount, createLocalVue } = require('@vue/test-utils');
const TDesign = require('tdesign-vue');
const { ChatAction } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatAction', () => {
  it('emits operation', async () => {
    const wrapper = mount(ChatAction, {
      localVue,
      propsData: { operationBtn: ['copy'], content: 'x' },
    });
    const btn = wrapper.find('.copy-btn');
    expect(btn.exists()).toBe(true);
    await btn.trigger('click');
    expect(wrapper.emitted('operation')).toBeTruthy();
  });
});

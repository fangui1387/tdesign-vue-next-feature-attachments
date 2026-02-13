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
const { ChatItem } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatItem', () => {
  it('renders content', () => {
    const wrapper = mount(ChatItem, {
      localVue,
      propsData: { role: 'assistant', content: 'hello' },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('hello');
  });
});

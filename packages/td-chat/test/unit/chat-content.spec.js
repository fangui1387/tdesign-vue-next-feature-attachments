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
const { ChatContent } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatContent', () => {
  it('renders content', async () => {
    const wrapper = mount(ChatContent, {
      localVue,
      propsData: { content: 'hello', role: 'assistant' },
    });
    expect(wrapper.exists()).toBe(true);
    await wrapper.setProps({ content: 'world' });
    expect(wrapper.html()).toContain('world');
  });
});

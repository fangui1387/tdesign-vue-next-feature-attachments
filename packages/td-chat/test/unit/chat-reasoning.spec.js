require('../force-vue2');

const { mount, createLocalVue } = require('@vue/test-utils');
const TDesign = require('tdesign-vue');
const { ChatReasoning } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatReasoning', () => {
  it('renders', () => {
    const wrapper = mount(ChatReasoning, {
      localVue,
      propsData: {
        collapsePanelProps: {
          header: 'header',
          content: 'content',
        },
      },
      stubs: {
        't-collapse': true,
        't-collapse-panel': true,
      },
      provide: {
        getRole: () => 'assistant',
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});

require('../force-vue2');

const { mount, createLocalVue } = require('@vue/test-utils');
const TDesign = require('tdesign-vue');
const { Chat } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('Chat', () => {
  it('renders', () => {
    const wrapper = mount(Chat, {
      localVue,
      propsData: { data: [] },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.t-chat').exists()).toBe(true);
  });

  it('renders message items', () => {
    const wrapper = mount(Chat, {
      localVue,
      propsData: {
        data: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there' },
        ],
      },
    });
    expect(wrapper.findAll('.t-chat__inner').length).toBe(2);
  });

  it('renders multiple VNodes from scoped slot (no fragment crash)', () => {
    const wrapper = mount(Chat, {
      localVue,
      propsData: {
        data: [{ role: 'assistant', content: 'x' }],
      },
      slots: {
        actions: ['<span>a</span>', '<span>b</span>'],
      },
    });
    expect(wrapper.text()).toContain('a');
    expect(wrapper.text()).toContain('b');
  });
});

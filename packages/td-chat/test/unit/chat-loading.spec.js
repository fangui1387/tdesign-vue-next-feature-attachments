require('../force-vue2');

const { mount, createLocalVue } = require('@vue/test-utils');
const TDesign = require('tdesign-vue');
const { ChatLoading } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatLoading', () => {
  it('renders', () => {
    const wrapper = mount(ChatLoading, { localVue, propsData: { text: 'loading' } });
    expect(wrapper.exists()).toBe(true);
  });
});

require('../force-vue2');

const { mount, createLocalVue } = require('@vue/test-utils');
const TDesign = require('tdesign-vue');
const { ChatSender } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatSender', () => {
  it('emits send', async () => {
    const wrapper = mount(ChatSender, { localVue, propsData: { defaultValue: 'hi' } });
    wrapper.vm.sendClick(new MouseEvent('click'));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('send')).toBeTruthy();
  });
});

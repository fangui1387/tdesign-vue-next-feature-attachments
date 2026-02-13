require('../force-vue2');

const { mount, createLocalVue } = require('@vue/test-utils');
const TDesign = require('tdesign-vue');
const { ChatInput } = require('../../lib/index.js');

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatInput', () => {
  it('emits send', async () => {
    const wrapper = mount(ChatInput, { localVue, propsData: { defaultValue: 'hi' } });
    await wrapper.find('.t-chat__footer__textarea__icon').trigger('click');
    expect(wrapper.emitted('send')).toBeTruthy();
  });
});

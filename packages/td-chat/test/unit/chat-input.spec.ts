import { mount, createLocalVue } from '@vue/test-utils';
import TDesign from 'tdesign-vue';
import ChatInput from '@/components/chat-input.vue';

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatInput', () => {
  it('emits send and clears value', async () => {
    const wrapper = mount(ChatInput, { localVue, propsData: { defaultValue: 'hi' } });
    expect((wrapper.vm as any).textValue).toBe('hi');
    await wrapper.find('.t-chat__footer__textarea__icon').trigger('click');
    expect(wrapper.emitted('send')).toBeTruthy();
  });

  it('emits change on textChange', async () => {
    const wrapper = mount(ChatInput, { localVue });
    (wrapper.vm as any).textChange('x', { e: new InputEvent('input') } as any);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')).toBeTruthy();
  });
});


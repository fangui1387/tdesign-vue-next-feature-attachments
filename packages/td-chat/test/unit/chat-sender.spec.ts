import { mount, createLocalVue } from '@vue/test-utils';
import TDesign from 'tdesign-vue';
import ChatSender from '@/components/chat-sender.vue';

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatSender', () => {
  it('emits send', async () => {
    const wrapper = mount(ChatSender, { localVue, propsData: { defaultValue: 'hi' } });
    (wrapper.vm as any).sendClick(new MouseEvent('click'));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('send')).toBeTruthy();
  });

  it('emits fileSelect on file change', async () => {
    const wrapper = mount(ChatSender, { localVue });
    const file = new File(['a'], 'a.txt', { type: 'text/plain' });
    (wrapper.vm as any).handleFileChange(
      { target: { files: [file], value: '' } } as any,
      { name: 'uploadAttachment' } as any,
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('fileSelect')).toBeTruthy();
  });
});


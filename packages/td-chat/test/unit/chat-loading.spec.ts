import { mount, createLocalVue } from '@vue/test-utils';
import TDesign from 'tdesign-vue';
import ChatLoading from '@/components/chat-loading.vue';

const localVue = createLocalVue();
localVue.use(TDesign);

describe('ChatLoading', () => {
  it('renders', () => {
    const wrapper = mount(ChatLoading, { localVue, propsData: { text: 'loading' } });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders moving indicator when animation is moving', () => {
    const wrapper = mount(ChatLoading, { localVue, propsData: { animation: 'moving', text: 'loading' } });
    expect(wrapper.find('.t-chat-loading__indicator--moving').exists()).toBe(true);
  });
});


import { mount, createLocalVue } from '@vue/test-utils';
import Chat from '@/components/chat.vue';
import TDesign from 'tdesign-vue';

const localVue = createLocalVue();
localVue.use(TDesign);

describe('Chat Component', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(Chat, {
      localVue,
      propsData: {
        data: []
      }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.t-chat').exists()).toBe(true);
  });

  it('renders messages correctly', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' }
    ];
    const wrapper = mount(Chat, {
      localVue,
      propsData: {
        data: messages
      }
    });
    
    const items = wrapper.findAll('.t-chat__inner');
    expect(items.length).toBe(2);
  });
});

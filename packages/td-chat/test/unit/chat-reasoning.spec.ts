import { mount, createLocalVue } from '@vue/test-utils';
import TDesign from 'tdesign-vue';
import ChatReasoning from '@/components/chat-reasoning.vue';

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
      provide: {
        getRole: () => 'assistant',
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});


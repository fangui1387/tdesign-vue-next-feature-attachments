import { mount, createLocalVue } from '@vue/test-utils';
import TNode from '@/components/TNode.vue';

const localVue = createLocalVue();

describe('TNode', () => {
  it('renders string content', () => {
    const wrapper = mount(TNode as any, { localVue, propsData: { content: 'hello' } });
    expect(wrapper.text()).toContain('hello');
  });

  it('renders vnode array content by wrapping', () => {
    const wrapper = mount(
      {
        render(h: any) {
          return h('div', [
            h(TNode as any, {
              props: { content: [h('span', 'a'), h('span', 'b')] },
            }),
          ]);
        },
      },
      { localVue },
    );
    expect(wrapper.findAll('span').length).toBe(2);
    expect(wrapper.text()).toContain('ab');
  });
});


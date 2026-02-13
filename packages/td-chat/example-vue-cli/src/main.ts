import Vue from 'vue';
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';
import TDesignChat from '@jump-mp/td-chat';
import './index.css';
import Demo from './demo.vue';

Vue.use(TDesign);
Vue.use(TDesignChat);

new Vue({
  render: (h) => h(Demo),
}).$mount('#app');

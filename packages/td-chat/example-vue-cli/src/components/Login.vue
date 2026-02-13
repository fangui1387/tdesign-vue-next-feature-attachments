<template>
  <div :style="{ width: '350px' }">
    <t-form status-icon :colon="true" :label-width="0" @submit="onSubmit" @reset="onReset">
      <t-form-item name="account">
        <t-input clearable placeholder="请输入账户名">
          <template #prefix-icon>
            <desktop-icon />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item name="password">
        <t-input type="password" clearable placeholder="请输入密码">
          <template #prefix-icon>
            <lock-on-icon />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item>
        <t-button theme="primary" type="submit" block>登录</t-button>
      </t-form-item>
    </t-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Form as TForm, FormItem as TFormItem, Input as TInput, Button as TButton, MessagePlugin } from 'tdesign-vue';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue';

export default defineComponent({
  name: 'LoginForm',
  components: {
    TForm,
    TFormItem,
    TInput,
    TButton,
    DesktopIcon,
    LockOnIcon,
  },
  setup() {
    const onSubmit = (e: any) => {
      if (e.validateResult === true) {
        MessagePlugin.info('提交成功');
      }
    };

    const onReset = (e: any) => {
      MessagePlugin.info('重置成功');
    };

    return {
      onSubmit,
      onReset,
    };
  },
});
</script>

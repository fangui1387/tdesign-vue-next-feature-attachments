<template>
  <t-chat-input v-model="query" :stop-disabled="loading" @send="inputEnter" @stop="handleStop"> </t-chat-input>
</template>

<script>
export default {
  name: 'ChatInputExample',
  data() {
    return {
      query: '',
      loading: false,
    };
  },
  methods: {
    handleStop() {
      this.loading = false;
    },
    inputEnter(inputValue) {
      if (this.loading) {
        return;
      }
      if (!inputValue) return;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    },
  },
};
</script>

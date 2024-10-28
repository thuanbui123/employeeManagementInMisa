<template>
  <main class="main-content">
    {{ page }}
  </main>
</template>

<script>
export default {
  name: 'MainContent',
  props: {
    page: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang='scss'>
  @use '@/assets/styles/_mainContent.scss';
</style>

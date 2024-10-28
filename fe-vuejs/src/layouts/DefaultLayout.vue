<template>
  <div id="wrapper">
    <HeaderComponent /> 
    <SidebarComponent @page-change="handlePageChange" /> 
    <div class="main-content">
      <!-- Nội dung các trang sẽ hiển thị ở đây thông qua Vue Router -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import SidebarComponent from '@/components/SidebarComponent.vue';

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  methods: {
    handlePageChange(page) {
      // Sử dụng Vue Router để điều hướng
      switch (page) {
        case 'Employee':
          this.$router.push({ name: 'Employee' }); // Điều hướng đến trang Employee
          break;
        case 'Home':
          this.$router.push({ name: 'Home' }); // Điều hướng đến trang Home
          break;
        case 'Report':
          this.$router.push({ name: 'ProductDetails', params: { id: 1 }  }); // Điều hướng đến trang Report
          break;
        case 'Setting':
          this.$router.push({ name: 'Setting' }); // Điều hướng đến trang Setting
          break;
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @use '@/assets/styles/defaultLayout.scss';
</style>

<style scoped>
#wrapper {
  background-color: rgb(240, 230, 255);
  height: 100vh;
  position: relative;
}
</style>

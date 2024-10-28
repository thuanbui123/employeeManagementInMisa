<template>
  <header id="header">
        <ul class="header-left">
            <li class="toggle-sidebar" @click="toggleSidebar">
                <img src="@/assets/img/toggle.png" />
            </li>
            <li><img class="logo-img" src="@/assets/cukcuk-logo.png" /></li>
            <li class="menu">
                <a>
                    <p>Chi nhánh Hà Nội</p>
                    <i class="icofont-curved-down"></i>
                </a>
                <ul class="subnav">
                    <li>Chi nhánh TP. Hồ Chí Minh</li>
                </ul>
            </li>
        </ul>
        <div class="header-right">
            <img src="@/assets/icon/avatar-default.png" alt="avatar" id="avatar">
            <p class="name">Bùi Văn Thuân</p>
            <button class="option">
                <img src="@/assets/icon/option.png" alt="option">
            </button>
        </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  methods: {
    toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.toggle('close');
      } else {
        console.error('Sidebar not found');
      }
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/_header.scss';
</style>

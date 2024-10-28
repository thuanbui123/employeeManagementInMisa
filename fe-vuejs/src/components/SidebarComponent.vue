<template>
    <div id="sidebar">
        <ul class="menu-sidebar">
        <li
            v-for="(item, index) in sidebarItems"
            :key="index"
            :class="{ item: true, active: activePage === item.page }"
            @click="handleClick(item.page)"
            :data-tooltip="item.tooltip"
        >
            <img :src="item.icon" :alt="item.alt" />
            <p>{{ item.name }}</p>
        </li>
        </ul>
    </div>
</template>

<script>
export default {
  data() {
    return {
      activePage: 'Home', // Trang mặc định khi khởi chạy
        sidebarItems: [
            {
                page: 'Home',
                tooltip: 'Trang chủ',
                icon: require('@/assets/icon/dashboard.png'),
                alt: 'Home',
                name: 'Trang chủ',
            },
            {
                page: 'Report',
                tooltip: 'Báo cáo',
                icon: require('@/assets/icon/report.png'),
                alt: 'Report',
                name: 'Báo cáo',
            },
            {
                page: 'Employee',
                tooltip: 'Nhân viên',
                icon: require('@/assets/icon/dic-employee.png'),
                alt: 'Employee',
                name: 'Nhân viên',
            },
            {
                page: 'Setting',
                tooltip: 'Cài đặt',
                icon: require('@/assets/icon/setting.png'),
                alt: 'Setting',
                name: 'Cài đặt',
            },
        ],
    };
  },
  methods: {
    handleClick(page) {
      this.activePage = page; // Cập nhật trang active
      this.$emit('page-change', page); // Gửi sự kiện lên component cha để cập nhật nội dung chính
    },
  },
};
</script>

<style scoped lang="scss">
  @use '@/assets/styles/_sidebar.scss';
</style>

<style scoped>

.menu-sidebar {
  list-style-type: none;
  padding: 0;
}

.item {
  cursor: pointer;
}

.active {
  background-color: #5e25b3; /* Màu nền cho item được chọn */
}
</style>

import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: 'Home Page' }, // Thay đổi tiêu đề cho trang Home
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: {title: 'About page'}
      },
      {
        path: 'employee',
        name: 'Employee',
        component: () => import('@/views/Employee.vue'),
        meta: {title: 'Quản lý nhân viên'}
      },
      {
        path: 'product/:id',
        name: 'ProductDetails',
        component: () => import('@/views/ProductDetails.vue'),
        meta: { title: 'Chi tiết sản phẩm'}
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = false; // Kiểm tra xem người dùng đã đăng nhập hay chưa
          if (!isAuthenticated) {
            next('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
          } else {
            next(); // Cho phép truy cập
          }
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Cập nhật tiêu đề khi route thay đổi
router.beforeEach((to) => {
  document.title = to.meta.title || 'Default Title'; // Thay đổi tiêu đề động
});

export default router

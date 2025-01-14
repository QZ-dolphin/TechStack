// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized} from 'vue-router';
import Login from '@/view/login/index.vue';
import Edit from '@/view/editpanel/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit,
    meta: { requiresAuth: true } // 添加此行以标记需要认证的路由
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const requiresAuth = to.meta?.requiresAuth; // 获取目标路由的认证要求
  const username = sessionStorage.getItem('username'); // 从sessionStorage中获取username

  if (requiresAuth && !username) {
    next({ path: '/' }); // 如果需要认证并且username不存在，则重定向到主页面
  } else {
    next(); // 否则继续导航
  }
});

export default router;

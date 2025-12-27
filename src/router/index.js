import { useUserStore } from '@/store/user';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/components/UserLogin.vue'),
    },
    {
      path: '/mainhome',
      component: () => import('@/components/MainHome.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/myinfo',
      component: () => import('@/components/MyInfo.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      component: () => import('@/components/UserRegister.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});
export default router;

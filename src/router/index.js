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
      path: '/newspage/:mainTab?/:subTab?',
      component: () => import('@/components/NewsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      component: () => import('@/components/UserRegister.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/registered-users',
      component: () => import('@/components/RegisteredUsers.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/shoppingcart',
      component: () => import('@/components/ShoppingCart.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/medical-statistics',
      component: () => import('@/components/MedicalStatistics.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/campus-scenery',
      component: () => import('@/components/CampusScenery.vue'),
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

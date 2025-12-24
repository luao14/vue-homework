import { useUserStore } from '@/store/user';
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import("@/components/Login.vue")
        },
        {
            path: '/main',
            component: () => import("@/components/Main.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: '/info',
            component: () => import("@/components/Info.vue"),
            meta: { requiresAuth: true }
        }

    ]
})
// 添加路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        // 如果访问需要认证的路由且未登录，则跳转到登录页
        next('/');
    } else {
        // 否则允许访问
        next();
    }
})
export default router;
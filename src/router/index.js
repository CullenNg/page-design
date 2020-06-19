import Vue from 'vue';
import Router from 'vue-router';

// 基础布局
import base from '@/layout/antd-layout.vue';

Vue.use(Router);

export const constantRouterMap = [
    { path: '/', redirect: '/home', },
    {
        path: '/home',
        component: base,
        redirect: '/home/index',
        meta: { name: '活动列表' },
        children: [
            {
                path: 'index',
                meta: { name: '活动列表', show_bread: false, },
                component: () => import('../views/home/index.vue')
            }
        ]
    },
    { path: '/design', meta: { name: '装修页' }, component: () => import('../views/design/index.vue') },
    { path: '*', redirect: '/404', hidden: true }
]

// 路由实例
const router = new Router({
    routes: constantRouterMap,
});

// 路由守卫
router.beforeEach((to, from, next) => {
    next();
});

export default router;


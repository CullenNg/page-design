import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index.js';
import { message } from 'ant-design-vue';

Vue.use(Router);

export const constantRouterMap = [
    { path: '/', redirect: '/design', },
    { path: '/design', meta: { name: '装修页' }, component: () => import('../views/design/index.vue') },
    { path: '*', redirect: '/404', hidden: true }
]

// 路由实例
const router = new Router({
    routes: constantRouterMap,
});

// 路由守卫
router.beforeEach((to, from, next) => {
    // 如果是装修页
    if (to.path === '/activity/zf/native-design/native222') {

        // 获取URL参数
        const { group_id = '', pipeline = '', lang = '', platform = 'm' } = to.query;

         // 拦截非法请求
         if (group_id === '' || pipeline === '' || lang === '' || platform === '') {
            message.error('非法请求');
            next(false);
            return false;
        }
   
        // 请求页面数据
        store.dispatch('design/page_load', {
            group_id,
            pipeline,
            lang,
            platform,
            callback (res) {
                next();
                // if (res.code === 0) {
                //     next();
                // } else {
                //     window.location.href = '/';
                // }
            }
        });
    } else {
        next();
    }
});

export default router;


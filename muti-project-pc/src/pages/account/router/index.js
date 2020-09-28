import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/user',
        },
        {
            path: '/user',
            name: 'account-user',
            component: () => import(/* webpackChunkName: "account-user" */ '@/pages/account/views/user/index.vue'),
            meta: {
              title: 'user'
            }
        },
        {
            path: '/login',
            name: 'account-login',
            component: () => import(/* webpackChunkName: "account-login" */ '@/pages/account/views/login/index.vue'),
            meta: {
              title: 'login'
            }
        },
        {
            path: '/register',
            name: 'account-register',
            component: () => import(/* webpackChunkName: "account-register" */ '@/pages/account/views/register/index.vue'),
            meta: {
              title: 'register'
            }
        }
    ]
})
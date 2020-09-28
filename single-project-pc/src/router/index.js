import Vue from 'vue';
import VueRouter from 'vue-router';

import blogRoute from './blog';
import pictureRoute from './picture';

Vue.use(VueRouter);

const allRoutes = [
    {
        path: '/',
        redirect: '/test'
    },
    {
        path: '/test',
        name: 'test',
        // component: () => import(/* webpackChunkName: "test" */ '@/package/test/index.vue'),
        component: resolve => require.ensure([], () => resolve(require('@/package/test/index.vue')), 'test'),
        meta: {
          title: 'test'
        }
    },
    ...blogRoute,
    ...pictureRoute,
]

export default new VueRouter({
    mode: 'hash',
    // base: '',
    routes: allRoutes
})
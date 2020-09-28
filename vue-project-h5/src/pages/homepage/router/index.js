import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/prod',
        },
        {
            path: '/prod',
            name: 'homepage-prod',
            component: () => import(/* webpackChunkName: "homepage-prod" */ '@/pages/homepage/views/prod/index.vue'),
            meta: {
              title: 'prod'
            }
        },
        {
            path: '/game',
            name: 'homepage-game',
            component: () => import(/* webpackChunkName: "homepage-game" */ '@/pages/homepage/views/game/index.vue'),
            meta: {
              title: 'game'
            }
        },
        {
            path: '/read',
            name: 'homepage-read',
            component: () => import(/* webpackChunkName: "homepage-read" */ '@/pages/homepage/views/read/index.vue'),
            meta: {
              title: 'read'
            }
        }
    ]
})
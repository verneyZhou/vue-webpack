
export default [
    {
      path: '/picture',
      redirect: '/picture/sence'
    },
    {
      path: '/picture',
      name: 'picture',
      // component: () => import(/* webpackChunkName: "picture" */ '@/package/picture/index.vue'),
      component: resolve => require.ensure([], () => resolve(require('@/package/picture/index.vue')), 'picture'),
      
      children: [ // 嵌套路由
        {
          path: 'sence',
          name: 'picture-sence',
          // component: () => import(/* webpackChunkName: "picture-sence" */ '@/package/picture/views/sence/index.vue'),
          component: resolve => require.ensure([], () => resolve(require('@/package/picture/views/sence/index.vue')), 'picture-sence'),
          meta: {
            title: 'picture-sence'
          }
        },
        {
            path: 'phone',
            name: 'picture-phone',
            // component: () => import(/* webpackChunkName: "picture-phone" */ '@/package/picture/views/phone/index.vue'),
            component: resolve => require.ensure([], () => resolve(require('@/package/picture/views/phone/index.vue')), 'picture-phone'),
            meta: {
              title: 'picture-phone'
            }
        },
      ]
    }
  ]
  
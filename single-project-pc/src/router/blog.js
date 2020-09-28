
export default [
    {
      path: '/blog',
      redirect: '/blog/fe'
    },
    {
      path: '/blog',
      name: 'blog',
      // component: () => import(/* webpackChunkName: "blog" */ '@/package/blog/index.vue'),
      component: resolve => require.ensure([], () => resolve(require('@/package/blog/index.vue')), 'blog'),
      children: [ // 嵌套路由
        {
          path: 'fe',
          name: 'blog-fe',
          // component: () => import(/* webpackChunkName: "blog-fe" */ '@/package/blog/views/fe/index.vue'),
          component: resolve => require.ensure([], () => resolve(require('@/package/blog/views/fe/index.vue')), 'blog-fe'),
          meta: {
            title: 'blog-fe'
          }
        },
        {
            path: 'note',
            name: 'blog-note',
            // component: () => import(/* webpackChunkName: "blog-note" */ '@/package/blog/views/note/index.vue'),
            component: resolve => require.ensure([], () => resolve(require('@/package/blog/views/note/index.vue')), 'blog-note'),
            meta: {
              title: 'blog-note'
            }
        },
      ]
    }
  ]
  
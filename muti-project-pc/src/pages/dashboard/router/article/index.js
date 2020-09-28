
export default [
    {
      path: '/article',
      redirect: '/article/fe'
    },
    {
      path: '/article',
      name: 'article',
      component: () => import(/* webpackChunkName: "dashboard-article" */ '@/pages/dashboard/views/article/index.vue'),
      children: [ // 嵌套路由
        {
          path: 'fe',
          name: 'article-fe',
          component: () => import(/* webpackChunkName: "dashboard-article-fe" */ '@/pages/dashboard/views/article/fe/index.vue'),
          meta: {
            title: 'article-fe'
          }
        },
        {
            path: 'note',
            name: 'article-note',
            component: () => import(/* webpackChunkName: "dashboard-article-note" */ '@/pages/dashboard/views/article/note/index.vue'),
            meta: {
              title: 'article-note'
            }
        },
        {
            path: 'story',
            name: 'article-story',
            component: () => import(/* webpackChunkName: "dashboard-article-story" */ '@/pages/dashboard/views/article/story/index.vue'),
            meta: {
              title: 'article-story'
            }
        },
      ]
    }
  ]
  
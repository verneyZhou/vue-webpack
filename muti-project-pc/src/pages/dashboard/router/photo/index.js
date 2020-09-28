
export default [
    {
      path: '/photo',
      redirect: '/photo/intro' // 重定向
    },
    {
      path: '/photo/intro',
      name: 'photo-intro',
      component: () => import(/* webpackChunkName: "dashboard-photo-intro" */ '@/pages/dashboard/views/photo/index.vue'), // 按需加载
      meta: {
        title: 'photo-intro'
      }
    },
    {
        path: '/photo/phone',
        name: 'photo-phone',
        component: () => import(/* webpackChunkName: "dashboard-photo-phone" */ '@/pages/dashboard/views/photo/phone/index.vue'), // 按需加载
        meta: {
          title: 'photo-phone'
        }
    },
    {
        path: '/photo/portrait',
        name: 'photo-portrait',
        component: () => import(/* webpackChunkName: "dashboard-photo-portrait" */ '@/pages/dashboard/views/photo/portrait/index.vue'), // 按需加载
        meta: {
          title: 'photo-portrait'
        }
    },
    {
        path: '/photo/sence',
        name: 'photo-sence',
        component: () => import(/* webpackChunkName: "dashboard-photo-sence" */ '@/pages/dashboard/views/photo/sence/index.vue'), // 按需加载
        meta: {
          title: 'photo-sence'
        }
    },
  
  ]
  
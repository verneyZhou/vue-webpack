export default [
    {
        path: '/tool',
        name: 'tool',
        component: () => import(/* webpackChunkName: "dashboard-tool" */ '@/pages/dashboard/views/tool/index.vue'), // 按需加载
        meta: {
          title: 'tool'
        }
    }
]
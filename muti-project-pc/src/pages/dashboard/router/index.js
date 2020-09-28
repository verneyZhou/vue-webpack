import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// dashboard页面路由导入：拆分路由，自动扫描子模块路由并导入
let routes = [
  {
    path: '/',
    redirect: '/article'
  }
]
/*
require.context是一个webpack的api,通过执行require.context函数获取一个特定的上下文,
主要用来实现自动化导入模块,在前端工程中,如果遇到从一个文件夹引入很多模块的情况,可以使用这个api,
它会遍历文件夹中的指定文件,然后自动导入,使得不需要每次显式的调用import导入模块

    三个参数：文件路径，是否遍历文件子目录，匹配文件的正则
*/
// 自动加载同级目录下的index.js结尾的文件
const routerContext = require.context('./', true, /index\.js$/)
console.log('======routerContext', routerContext.keys())
routerContext.keys().forEach(v => {
  // 如果是根目录的 index.js 不处理
  if (v.startsWith('./index')) return
  console.log('=======', v)
  const routerModule = routerContext(v)
  //  兼容 import export 和 require module.export 两种规范
  routes = [...routes, ...(routerModule.default || routerModule)]
  console.log('======routes', routes)
})

export default new Router({
  mode: 'hash', // 默认hash模式，history模式需要后台支持 暂不考虑
  routes
})

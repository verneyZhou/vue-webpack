import 'lib-flexible';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#root');

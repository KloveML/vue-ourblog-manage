import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 加载组件
const home = r => require.ensure([], () => { r(require('../pages/home/home.vue'), 'home'); });
const login = r => require.ensure([], () => { r(require('../pages/login/login.vue'), 'login'); });
const emptyContent = r => require.ensure([], () => { r(require('../components/common/emptyContent.vue'), 'emptyContent'); });
const articlePreview = r => require.ensure([], () => { r(require('../components/common/articlePreview.vue'), 'articlePreview'); });
const articleEdit = r => require.ensure([], () => { r(require('../components/common/articleEdit.vue'), 'articleEdit'); });

const routes = [
  {
    path: '/admin',
    name: 'home',
    redirect: '/admin/articleList'
  },
  {
    path: '/admin/:id',
    component: home,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '',
        name: 'admin_emptyContent',
        component: emptyContent
      },
      {
        path: 'articlePreview',
        name: 'admin_articlePreview',
        component: articlePreview
      },
      {
        path: 'articleEdit',
        name: 'admin_articleEdit',
        component: articleEdit
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login
  }
];
const router = new Router({
  mode: 'history',
  routes
});
// 定义全局的导航钩子
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    const adminer = window.sessionStorage.getItem('adminer');
    if (!adminer) {
      next({
        path: '/login'
      });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});
export default router;

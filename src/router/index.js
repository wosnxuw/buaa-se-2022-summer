import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView')
  },
  {
    path: '/manageProject',
    name: 'manageProject',
    component: () => import('../views/ManageProject'),

  },
  {
    path: '/manageRubbish',
    name: 'manageRubbish',
    component: () => import('../views/ManageRubbish'),

  },
  {
    path: '/addProject',
    name: 'addProject',
    component: () => import('../views/AddProject'),

  },
  {
    path: '/manageTeam',
    name: 'manageTeam',
    component: () => import('../views/ManageTeam'),
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/ProjectInfo'),
  },
  {
    path: '/documentEdit',
    name: 'documentEdit',
    component: () => import('../views/DocumentEdit'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

import user from "@/store/user";

/*判断访问页面若需要登录且当前未登录，则拦截至登录路由*/
router.beforeEach((to, from, next) => {
  // 通过 Vuex 获取用户登录信息
  const userInfo = user.getters.getUser(user.state());
  // 若用户未登录且访问的页面需要登录，则跳转至登录页面
  if (!userInfo && to.meta.requireAuth) {
    next({
      name: 'login',
    })
  }
  next()
})

/*被拦截后登录成功后，能自动返回原先访问的路由地址*/
// router.beforeEach((to, from, next) => {
//   // 通过 Vuex 获取用户登录信息
//   const userInfo = user.getters.getUser(user.state());
//
//   // 若前往的是登录路由，则保存当前路由到 preRoute 的键值对中，以便登录成功后跳转
//   if (to.path === '/login') {
//     localStorage.setItem("preRoute", router.currentRoute.fullPath);
//   }
//   // 若用户未登录且访问的页面需要登录，则跳转至登录页面
//   if (!userInfo && to.meta.requireAuth) {
//     next({
//       name: 'login',
//     })
//   }
//
//   next()
// })

export default router

// import Vue from 'vue'
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)

// import Designer from '@/views/designer/index'
// import Preview from '@/views/preview/index'
// import DocumentEdit from '../views/DocumentEdit'

// // 创建 router 实例，然后传 `routes` 配置
// export default new VueRouter({
//     //mode: 'history',
//     routes: [

//         {
//             path: '/login',
//             name: 'login',
//             component: Designer,  //用于调试
//             // component: DocumentEdit
//             // component: () => import('../views/LoginView')
//             // component: () => import('../views/RegisterView')

//         }, 
//         {
//             path:'/register',
//             name:'register',
//             component: () => import('../views/RegisterView')
//         },
//         {
//             path: '/docEdit',
//             name: 'docEdit',
//             component: DocumentEdit
//         },{
//             path: '/design',
//             name: 'design',
//             component: Designer
//         }, {
//             path: '/preview',
//             name: 'preview',
//             component: Preview
//         }, {
//             path: '/view',
//             name: 'view',
//             component: Preview
//         }
//     ]
// })



import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'

import Designer from '@/views/designer/index'
import Preview from '@/views/preview/index'
import DocumentEdit from '../views/DocumentEdit'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import( '../views/HomeView.vue'),
  },
  {
    path: '/markdownEdit',
    name: 'markdownEdit',
    component: () => import( '../views/MarkDown.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView')
    // component:Designer
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
    // component: () => import('../views/DocumentEdit'),
    component: DocumentEdit
  },
  {
    path: '/design',
    name: 'design',
    // component: () => import('../views/DesignProject'),
    component: Designer
  },
  {
    path: '/chooseTeam',
    name: 'chooseTeam',
    component: () => import('../views/ChooseTeam'),
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('../views/DocsView'),
  },
  {
    path: '/docsList',
    name: 'docsList',
    component: () => import('../views/DocsList'),
  },
  {
    path: '/draw',
    name: 'draw',
    component: () => import('../views/DrawList'),
  },{
    path: '/view',
    name: 'view',
    component: Preview
  },{
    path: '/preview',
    name: 'preview',
    component: Preview
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

import router from './router'
import { getToken } from '@/utils/auth'
import env from "/env"; // get token from cookie

const whiteList = ['/login', '/404', '/design', '/view', '/preview', '/register', '/about', '/manageProject', '/manageRubbish', '/addProject', '/manageTeam', '/project','/documentEdit','/chooseTeam','/docs','/docsList','/draw','/home','/markdownEdit'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      if ('/design' === to.path && env.active === 'dev'){
        next(`/home`)
      }
      next()
    } else {
      next(`/home?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
})

import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/views/Home/Home')
const CollectFace = () => import('@/views/CollectFace/CollectFace')

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: '/web',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { scrollToTop: true, title: '虚拟校园卡' }
    },
    {
      path: '/collectFace',
      name: 'CollectFace',
      component: CollectFace,
      meta: { scrollToTop: true, title: '采集人脸' }
    },
    {
      path: '/*',
      redirect: '/'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

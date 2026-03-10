import Vue from 'vue'
import Router from 'vue-router'
import {constantRouterMap} from './constantRouterMap.js'

Vue.use(Router)

/* 常量路由 */



const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export default router

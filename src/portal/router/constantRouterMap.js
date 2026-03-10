import Login from '../views/login'
import BbspLogin from '@/views/bbspLogin'
import casLogin from '@/views/cas/login'
import Layout from '@/views/frame/Layout.vue'
import IELayout from '@/views/frame/IELayout.vue'
import AppMain from '@/views/frame/AppMain.vue'
import EmbedMenuMain from '@/views/embed/embedMenuMain.vue'
import Logout from '@/views/logout.vue'
import singleSignOnLogin from '@/views/singleSignOnLogin'
// import MainIndex from '@/views/mainIndex.vue'
// let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0  ? true : false
let isIE = false;
export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/cas/login',
    component: casLogin,
    hidden: true
  },
  {
    path: '/',
    component: isIE ? AppMain : Layout,
    redirect: isIE ? '/indexcommon' : '/mainIndex',
    children: [{
      path: '/mainIndex',
      name: '首页',
      component:() => import(/* webpackChunkName: "mainIndex" */`@/views/mainIndex.vue`),
      hidden: true,
      meta: {
        id: 'mainIndex',
        comName: 'mainIndex',
        isKeepAlive:true
      }
    }]
  },
  {
    path: '/indexcommon',
    component: IELayout,
  },
  {
    path: '/bbspLogin',
    component: BbspLogin,
    hidden: true,
    meta: {
      id: 'bbspLogin',
      comName: 'bbspLogin',
      isKeepAlive:true
    }
  },
  {
    path: '/embedMenuMain',
    component: EmbedMenuMain,
    hidden: true,
    meta: {
      id: 'embedMenuMain',
      comName: 'embedMenuMain',
      isKeepAlive:true
    }
  },
  {
    path:'/logout',
    component:Logout,
    hidden:true
  },
  {
    path: '/singleSignOnLogin',
    component: singleSignOnLogin,
    hidden: true
  }
]

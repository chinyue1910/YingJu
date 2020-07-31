import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'
import Profile from '../components/Member/Profile.vue'
import Cart from '../components/Member/Cart.vue'
import Privacy from '../components/Member/Privacy.vue'
import Track from '../components/Member/Track.vue'
import Message from '../components/Manager/Message.vue'
import Article from '../components/Manager/Article.vue'
import Display from '../components/Manager/Display.vue'
import Membership from '../components/Manager/Membership.vue'
import Order from '../components/Manager/Order.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      login: false,
      title: '映筑香菇農場'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      login: false,
      title: '映筑香菇農場 | 香菇故事'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/Contact.vue'),
    meta: {
      login: false,
      title: '映筑香菇農場 | 聯絡我們'
    }
  },
  {
    path: '/member',
    component: () => import(/* webpackChunkName: "member" */ '../views/Member.vue'),
    children: [
      {
        path: 'profile',
        component: Profile,
        meta: {
          login: true,
          title: '會員資料 |個人資訊',
          route: 'Member'
        }
      },
      {
        path: 'privacy',
        component: Privacy,
        meta: {
          login: true,
          title: '會員資料 | 隱私資訊',
          route: 'Member'
        }
      },
      {
        path: 'track',
        component: Track,
        meta: {
          login: true,
          title: '會員資料 | 購物追蹤',
          route: 'Member'
        }
      },
      {
        path: 'cart',
        component: Cart,
        meta: {
          login: true,
          title: '會員資料 |購物清單',
          route: 'Member'
        }
      }
    ],
    meta: {
      login: true,
      route: 'Member'
    }
  },
  {
    path: '/manager',
    component: () => import(/* webpackChunkName: "manager" */ '../views/Manager.vue'),
    children: [
      {
        path: 'message',
        component: Message,
        meta: {
          login: true,
          title: '管理介面 | 用戶訊息',
          route: 'Manager'
        }
      },
      {
        path: 'order',
        component: Order,
        meta: {
          login: true,
          title: '管理介面 | 訂單管理',
          route: 'Manager'
        }
      },
      {
        path: 'display',
        component: Display,
        meta: {
          login: true,
          title: '管理介面 | 商品管理',
          route: 'Manager'
        }
      },
      {
        path: 'membership',
        component: Membership,
        meta: {
          login: true,
          title: '管理介面 | 會員管理',
          route: 'Manager'
        }
      },
      {
        path: 'article',
        component: Article,
        meta: {
          login: true,
          title: '管理介面 | 發文管理',
          route: 'Manager'
        }
      }
    ],
    meta: {
      login: true,
      route: 'Manager'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import(/* webpackChunkName: "news" */ '../views/News.vue'),
    meta: {
      login: false,
      title: '映筑香菇農場 | 最新消息'
    }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import(/* webpackChunkName: "product" */ '../views/Product.vue'),
    meta: {
      login: false,
      title: '映筑香菇農場 | 商品介紹'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      login: false,
      title: '映筑香菇農場 | 用戶登入'
    }
  },
  {
    path: '/sign',
    name: 'Sign',
    component: () => import(/* webpackChunkName: "sign" */ '../views/Sign.vue'),
    meta: {
      login: false,
      title: '映筑香菇農場 | 用戶註冊'
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.login) {
    if (store.state.user.userAccount.length === 0) {
      next('/login')
    } else if (store.state.user.userAccount === 'manager@gmail.com' && to.meta.route !== 'Manager') {
      if (from.path === '/manager/order') {
        next()
      } else {
        next('/manager/order')
      }
    } else if (store.state.user.userAccount !== 'manager@gmail.com' && to.meta.route === 'Manager') {
      next(from.path)
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router

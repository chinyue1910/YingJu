import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' // Vuesax styles

import './css/style.css'

import animated from 'animate.css'

import VueAgile from 'vue-agile'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBahai, faBars, faTimes, faAngleDoubleRight, faAngleDoubleLeft, faShoppingCart, faCartPlus, faAngleRight, faAngleLeft, faUserCircle, faUser } from '@fortawesome/free-solid-svg-icons'

import { faFacebookF, faGoogle, faLine } from '@fortawesome/free-brands-svg-icons'

import 'material-icons/iconfont/material-icons.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

import ImgInputer from 'vue-img-inputer'
import 'vue-img-inputer/dist/index.css'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

library.add(faBahai, faBars, faTimes, faAngleDoubleRight, faAngleDoubleLeft, faShoppingCart, faCartPlus, faAngleRight, faAngleLeft, faUserCircle, faFacebookF, faGoogle, faUser, faLine)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component('ImgInputer', ImgInputer)

Vue.use(animated)

Vue.use(VueAgile)

Vue.use(Vuesax)

Vue.use(VueAxios, axios)

Vue.use(VueSweetalert2)

axios.defaults.withCredentials = true

Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

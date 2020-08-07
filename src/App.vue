<template lang="pug">
  #app
    vs-icon#bigNav(icon="menu" @click="showContent" v-if="opacity == 0" :style="{display:navshow}")
    keep-alive
      router-view(:style="{filter:`blur(${blur}px)`}" ref="childMethod" @changenavshow="changenavshow" @showContent="showContent" :fullwidth="fullwidth")
    navbarContent(
      :style="{opacity:opacity,visibility:visibility}"
      @closeContent='closeContent'
      :show="show")
</template>

<script>
import navbarContent from '@/components/navbarContent'
export default {
  components: { navbarContent },
  data () {
    return {
      opacity: 0,
      visibility: 'hidden',
      blur: 0,
      show: false,
      navshow: 'block',
      fullwidth: 0
    }
  },
  methods: {
    showContent () {
      this.opacity = 0.9
      this.visibility = 'visible'
      this.blur = 5
      this.show = !this.show
    },
    closeContent () {
      this.opacity = 0
      this.visibility = 'hidden'
      this.blur = 0
      this.show = !this.show
    },
    changenavshow () {
      this.navshow = (this.navshow === 'block') ? 'none' : 'block'
    },
    heartbeat () {
      this.axios.get(process.env.VUE_APP_APIURL + '/heartbeat')
        .then(response => {
          const data = response.data
          // 如果登入中
          if (this.user.length > 0) {
          // 如果登入時間過期
            if (!data) {
              alert('登入時效已過')
              // 前端登出
              this.$store.commit('logout')
              // 如果現在不是在首頁，跳到登出後的首頁
              if (this.$route.path !== '/') {
                this.$router.push('/')
              }
            }
          }
        })
        .catch(error => {
          alert(error)
          this.$store.commit('logout')
          // 如果現在不是在首頁，跳到登出後的首頁
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
        })
    }
  },
  watch: {
    $route (to, from) {
      this.navshow = (to.meta.route === 'Member' || to.meta.route === 'Manager') ? 'none' : 'block'
    }
  },
  mounted () {
    this.fullwidth = window.innerWidth
    window.onresize = () => {
      this.fullwidth = window.innerWidth
    }
    this.heartbeat()
    setInterval(() => {
      this.heartbeat()
    }, 1000 * 60 * 5)

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '3109557419151059',
        cookie: true,
        xfbml: true,
        version: 'v8.0'
      })

      window.FB.AppEvents.logPageView()
    }
  },
  computed: {
    user () {
      return this.$store.getters.username
    }
  }
}
</script>

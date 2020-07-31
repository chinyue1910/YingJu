<template lang="pug">
  b-sidebar#sidebar(shadow no-header :visible="visible" no-close-on-route-change :backdrop="backdrop" @hidden="$emit('sidebarclose')")
    b-avatar(size="100px" :src="src" to="/member/profile")
    .sidebar-item(v-for="(item,index) in sidebarItems" @click="$router.push(item.link)")
      vs-icon(:icon="item.icon" size="2rem").mx-5
      | {{ item.text }}
    .sidebar-item2(v-for="(item,index) in sidebarItems2")
      vs-icon(:icon="item.icon" size="2rem").mx-5
      | {{ item.text }}
</template>

<script>
export default {
  props: {
    visible: Boolean,
    fullwidth: Number
  },
  data () {
    return {
      sidebarItems: [
        { icon: 'perm_identity', text: '個人資訊', link: '/member/profile' },
        { icon: 'shopping_cart', text: '購物清單', link: '/member/Cart' },
        { icon: 'security', text: '隱私資訊', link: '/member/privacy' },
        { icon: 'local_shipping', text: '購物追蹤', link: '/member/track' }
      ],
      sidebarItems2: [
        { icon: 'notifications', text: '通知總覽' },
        { icon: 'help', text: '幫助中心' },
        { icon: 'exit_to_app', text: '登出' }
      ],
      src: ''
    }
  },
  computed: {
    backdrop () {
      return (this.fullwidth < 992)
    },
    userID () {
      return this.$store.getters.userID
    }
  },
  mounted () {
    this.axios
      .get(process.env.VUE_APP_APIURL + '/profile/' + this.userID)
      .then(response => {
        this.src = process.env.VUE_APP_APIURL + '/profile/image/' + response.data.result[0].src
      })
      .catch(error => {
        this.$vs.notify({
          title: error.response.data.message,
          color: 'danger',
          icon: 'close'
        })
      })
  },
  created () {
    this.$bus.$on('sendsrc', msg => {
      this.changesrc(msg)
    })
  },
  methods: {
    changesrc (msg) {
      this.src = process.env.VUE_APP_APIURL + '/profile/image/' + msg
    }
  }
}
</script>

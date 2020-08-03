<template lang="pug">
  b-sidebar#sidebar(shadow no-header :visible="visible" no-close-on-route-change :backdrop="backdrop" @hidden="$emit('sidebarclose')")
    b-avatar(size="100px" :src="src" to="/member/profile")
    .sidebar-item(v-for="(item,index) in sidebarItems" @click="itemclick(item.link)")
      vs-icon(:icon="item.icon" size="2rem").mx-5
      | {{ item.text }}
    .sidebar-item2
      vs-icon(:icon="sidebarItems2[0].icon" size="2rem").mx-5
      | {{ sidebarItems2[0].text }}
    .sidebar-item2(@click="logout")
      vs-icon(:icon="sidebarItems2[1].icon" size="2rem").mx-5
      | {{ sidebarItems2[1].text }}
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
    },
    itemclick (index) {
      this.$router.push(index)
      if (this.backdrop) {
        this.$emit('sidebarclose')
      }
    },
    logout () {
      this.axios.delete(process.env.VUE_APP_APIURL + '/logout')
        .then(response => {
          const data = response.data
          if (data.success) {
            this.$swal({
              title: '登出成功',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            }).then(result => {
              if (result.value || result.isDismissed) {
                this.$store.commit('logout')
                this.$router.push('/')
              }
            })
          } else {
            this.$swal({
              title: data.message,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
          }
        })
        .catch(error => {
          this.$swal({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '確定'
          })
        })
    }
  }
}
</script>

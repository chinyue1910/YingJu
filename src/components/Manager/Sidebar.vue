<template lang="pug">
  b-sidebar#sidebar(shadow no-header :visible="visible" no-close-on-route-change :backdrop="backdrop" @hidden="$emit('sidebarclose')")
    b-avatar(size="100px" src="https://picsum.photos/1920/1080/?random=2" to="/member/profile")
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
        { icon: 'shopping_cart', text: '訂單管理', link: '/manager/order' },
        { icon: 'ballot', text: '商品管理', link: '/manager/display' },
        { icon: 'comment', text: '發文管理', link: '/manager/article' },
        { icon: 'supervisor_account', text: '會員管理', link: '/manager/membership' },
        { icon: 'equalizer', text: '最新消息', link: '/manager/message' }
      ],
      sidebarItems2: [
        { icon: 'help', text: '幫助中心' },
        { icon: 'exit_to_app', text: '登出' }
      ]
    }
  },
  computed: {
    backdrop () {
      return (this.fullwidth < 992)
    }
  },
  methods: {
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
    },
    itemclick (index) {
      this.$router.push(index)
      if (this.backdrop) {
        this.$emit('sidebarclose')
      }
    }
  }
}
</script>

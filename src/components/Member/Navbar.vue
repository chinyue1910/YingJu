<template lang="pug">
  b-navbar(toggleable="lg" type="dark" variant="dark" sticky=true).py-0
    b-navbar-brand(@click="$emit('showContent')").ml-auto 回首頁
    b-navbar-toggle(target="" :style="{margin:'14px 0 14px 0'}" @click="$emit('changesidebar')").ml-auto
      template(v-slot:default="{ expanded }")
        b-icon(v-if="visible" icon="X")
        b-icon(v-else icon="List")
    b-collapse(is-nav).flex-grow-0
      b-navbar-nav.d-flex.align-items-center
        b-nav-item
          vs-icon(icon="help" size="1.5rem").mr-2
          | 幫助
        b-nav-item
          vs-avatar(icon="notifications" :badge="0" size="1.5rem" :style="{background:'transparent'}")
        b-nav-item(@click="logout")
          vs-icon(icon="exit_to_app" size="1.5rem").mr-2
          | 登出
        b-nav-item(to="/member/profile")
          | {{ username }} 你好
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  methods: {
    logout () {
      this.axios.delete(process.env.VUE_APP_APIURL + '/logout')
        .then(response => {
          const data = response.data
          if (data.success) {
            this.$store.commit('logout')
            this.$swal({
              title: '登出成功',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            }).then(result => {
              if (result.value || result.isDismissed) {
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
  },
  computed: {
    username () {
      return this.$store.getters.username
    }
  }
}
</script>

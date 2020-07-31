<template lang="pug">
b-navbar.py-0(toggleable="lg", type="dark", variant="dark", sticky)
  b-navbar-brand.ml-auto(@click="$emit('showContent')") 回首頁
  b-navbar-toggle.ml-auto(
    target="",
    :style="{ margin: '14px 0 14px 0' }",
    @click="$emit('changesidebar')"
  )
    template(v-slot:default="{ expanded }")
      b-icon(v-if="visible", icon="X")
      b-icon(v-else, icon="List")
  b-collapse.flex-grow-0(is-nav)
    b-navbar-nav.d-flex.align-items-center
      b-nav-item
        vs-icon.mr-2(icon="help", size="1.5rem")
        | 幫助
      b-nav-item(@blur="hidden")
        vs-avatar#popover(
          icon="notifications",
          :badge="alert",
          size="1.5rem",
          :style="{ background: 'transparent' }"
        )
        b-popover(
          target="popover",
          placement="bottom",
          triggers="click",
          @shown="shown"
        )
          template(v-slot:default)
            ul.mb-0(
              @click="route",
              :style="{ cursor: 'pointer' }",
              v-if="popovers.length > 0"
            )
              li(v-for="(popover, index) in popovers")
                | 有一則來自
                span.text-info {{ popover.name }}
                | 的訊息
                span.text-secondary.ml-3 {{ popover.content }}
            p.mb-0(v-else) 目前沒有任何新消息
      b-nav-item(@click="logout")
        vs-icon.mr-2(icon="exit_to_app", size="1.5rem")
        | 登出
      b-nav-item(to="/member/profile")
        | {{ username }} 你好
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      alert: 0,
      popovers: ''
    }
  },
  methods: {
    shown () {
      this.alert = 0
      if (this.popovers.length > 0) {
        this.axios.patch(process.env.VUE_APP_APIURL + '/message')
      }
    },
    hidden () {
      this.$root.$emit('bv::hide::popover')
    },
    route () {
      this.$router.push('/manager/message')
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
  },
  computed: {
    username () {
      return this.$store.getters.username
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/message')
      .then(response => {
        this.alert = response.data.result.filter(d => {
          return d.checked === false
        }).length
        const result = response.data.result.filter(d => {
          return d.checked === false
        })
        for (const i of result) {
          const limit = i.time = parseInt((Date.now() - i.time) / 1000)
          if (limit < 60) {
            i.content = '剛剛'
          } else if (limit >= 60 && limit < 3600) {
            i.content = Math.floor(limit / 60) + '分鐘前'
          } else if (limit >= 3600 && limit < 86400) {
            i.content = Math.floor(limit / 3600) + '小時前'
          } else if (limit >= 86400 && limit < 2592000) {
            i.content = Math.floor(limit / 86400) + '天前'
          } else if (limit >= 2592000 && limit < 31104000) {
            i.content = Math.floor(limit / 2592000) + '個月前'
          } else {
            i.content = '超過一個月前'
          }
        }
        this.popovers = result
      })
      .catch(error => {
        this.$vs.notify({
          title: error.response.data.message,
          color: 'danger',
          icon: 'close'
        })
      })
  }
}
</script>

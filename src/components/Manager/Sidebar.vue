<template lang="pug">
  b-sidebar#sidebar(shadow no-header :visible="visible" no-close-on-route-change :backdrop="backdrop" @hidden="$emit('sidebarclose')")
    b-avatar(size="100px" src="https://picsum.photos/1920/1080/?random=2" to="/member/profile")
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
        { icon: 'shopping_cart', text: '訂單管理', link: '/manager/order' },
        { icon: 'ballot', text: '商品管理', link: '/manager/display' },
        { icon: 'comment', text: '發文管理', link: '/manager/article' },
        { icon: 'supervisor_account', text: '會員管理', link: '/manager/membership' },
        { icon: 'equalizer', text: '最新消息', link: '/manager/message' }
      ],
      sidebarItems2: [
        { icon: 'notifications', text: '通知總覽' },
        { icon: 'help', text: '幫助中心' },
        { icon: 'exit_to_app', text: '登出' }
      ]
    }
  },
  computed: {
    backdrop () {
      return (this.fullwidth < 992)
    }
  }
}
</script>

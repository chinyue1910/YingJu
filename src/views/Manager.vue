<template lang="pug">
  #manager
    Sidebar(:visible="visible" :fullwidth="fullwidth" @sidebarclose="sidebarclose")
    b-container(fluid).p-0
      b-row.m-0
        b-col(:style="{flex:sidebarwidth}").p-0
        b-col.p-0
          Navbar(@changesidebar="changesidebar" @showContent="$emit('showContent')" :visible="visible")
          router-view
</template>

<script>
import Sidebar from '../components/Manager/Sidebar'
import Navbar from '../components/Manager/Navbar'
export default {
  components: {
    Sidebar,
    Navbar
  },
  data () {
    return {
      visible: false
    }
  },
  props: {
    fullwidth: Number
  },
  methods: {
    changesidebar () {
      this.visible = !this.visible
    },
    sidebarclose () {
      this.visible = false
    }
  },
  watch: {
    fullwidth () {
      this.visible = (this.fullwidth >= 992)
    }
  },
  mounted () {
    this.visible = (this.fullwidth >= 992)
  },
  computed: {
    sidebarwidth () {
      return (this.fullwidth >= 992) ? '0 0 320px' : '0 0 0'
    }
  }
}
</script>

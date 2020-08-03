<template lang="pug">
  u-animate-container(:style="{height:'100%'}").d-flex.align-items-center.justify-content-center
    u-animate(
      :name='name'
      delay='0s'
      duration='1s'
      :iteration='1'
      :offset='150'
      animate-class='animated'
      :begin='false')
        slot
</template>

<script>
export default {
  props: {
    index: Number
  },
  computed: {
    name () {
      return (this.index % 2) === 1 ? 'animate__fadeInLeftBig' : 'animate__fadeInRightBig'
    }
  }
}
</script>

<template lang="pug">
  section
    agile(
    ref="carousel"
    :autoplay="true"
    :speed="3000"
    :autoplaySpeed="10000"
    :fade="true"
    )
      img.slide(:src="img.src" v-for="(img,index) in imgs")
      template(slot="prevButton")
        font-awesome-icon(:icon=['fas','angle-left'] size="3x")
      template(slot="nextButton")
        font-awesome-icon(:icon=['fas','angle-right'] size="3x")
</template>

<script>
export default {
  data () {
    return {
      imgs: [
        { src: 'https://picsum.photos/1920/1080/?image=99' },
        { src: 'https://picsum.photos/1920/1080/?image=11' },
        { src: 'https://picsum.photos/1920/1080/?image=12' }
      ]
    }
  }
}
</script>

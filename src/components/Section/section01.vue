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
import img1 from '../../assets/images/section1-1.jpg'
import img2 from '../../assets/images/section1-2.jpg'
import img3 from '../../assets/images/section1-3.jpg'
export default {
  data () {
    return {
      imgs: [
        { src: img1 },
        { src: img2 },
        { src: img3 }
      ]
    }
  }
}
</script>

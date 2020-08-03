<template lang="pug">
  section
    b-container(fluid :style="{background:'#52453c'}")
      b-row.py-5.justify-content-center
        b-col.story(cols="12" sm="3" v-for="(img,index) in imgs" :key="index").my-2
          img(:src="img.src")
        b-col(cols="12" sm="6").d-flex.justify-content-center.align-items-center
          h4.py-3 誰知盤中菇，朵朵皆辛苦
</template>

<script>
import img1 from '../../assets/images/section4-1.jpg'
import img2 from '../../assets/images/section4-2.jpg'
export default {
  data () {
    return {
      imgs: [
        { src: img1 },
        { src: img2 }
      ]
    }
  }
}
</script>

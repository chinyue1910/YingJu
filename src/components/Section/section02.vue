<template lang="pug">
  section
    b-container(fluid :style="{background:'#52453c'}")
      b-row.h-100.py-3
        b-col.d-flex.justify-content-center.align-items-center(cols="12" sm="6")
          h4.py-3 關於我們的小故事
        b-col.d-flex.flex-wrap.flex-column.flex-sm-row.align-items-center(cols="12" sm="6")
          b-col.story(cols="0" sm="6" v-for="(img,index) in imgs" :key="index").my-2
            img(:src="img.src")
</template>

<script>
import img1 from '../../assets/images/section2-1.jpg'
import img2 from '../../assets/images/section2-2.jpg'
import img3 from '../../assets/images/section2-3.jpg'
import img4 from '../../assets/images/section2-4.jpg'
export default {
  data () {
    return {
      imgs: [
        { src: img1 },
        { src: img2 },
        { src: img3 },
        { src: img4 }
      ]
    }
  }
}
</script>

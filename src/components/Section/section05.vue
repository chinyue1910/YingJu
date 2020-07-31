<template lang="pug">
  section
    svg(height="100%" :style="{transform:'rotate(180deg)',height:'50px'}" fill="#52453c" width="100%" viewBox="0 0 1000 100" preserveAspectRatio="none")
      path(d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z")
    h4.py-3 香菇的出生
    b-container(fluid)
      b-row.h-card(v-for="(box,index) in boxs" :key="index").py-2
        b-col(cols="12" sm="6")
          wow(:index="index+1")
            img(:src="box.src")
        b-col.d-flex.align-items-center(cols="12" sm="6")
          wow(:index="index").px-3 {{ box.text }}
    svg(height="100%" :style="{transform:'rotate(0deg)',height:'50px'}" fill="#52453c" width="100%" viewBox="0 0 1000 100" preserveAspectRatio="none")
      path(d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z")
</template>

<script>
import wow from './WOWjs'
export default {
  components: {
    wow
  },
  data () {
    return {
      boxs: [
        {
          src: 'https://picsum.photos/1920/1080/?random=86',
          text: 'sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat id porta nibh'
        },
        {
          src: 'https://picsum.photos/1920/1080/?random=87',
          text: 'sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat id porta nibh'
        },
        {
          src: 'https://picsum.photos/1920/1080/?random=88',
          text: 'sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat id porta nibh'
        },
        {
          src: 'https://picsum.photos/1920/1080/?random=89',
          text: 'sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat id porta nibh'
        }
      ]
    }
  }
}
</script>

<template lang="pug">
  b-container#navbarContent.px-0(fluid)
    transition(enter-active-class="animate__animated animate__rotateIn" leave-active-class="animate__animated animate__rotateOut")
      vs-icon(v-if="show" icon="close" :style="{fontSize:'3rem'}" color="white" @click="$emit('closeContent')")
    b-row.h-100
      transition(enter-active-class="animate__animated animate__fadeInUp animate__delay-1s")
        b-link(v-if="show" to='/' @click="backtohome")
          img(:src="src").mr-3
          | 回首頁
      transition(enter-active-class="animate__animated animate__fadeInUp animate__delay-1s")
        b-link(v-if="show" to='/news' @click="$emit('closeContent')") 最新消息
      transition(enter-active-class="animate__animated animate__fadeInUp animate__delay-1s")
        b-link(v-if="show" to='/about' @click="$emit('closeContent')") 香菇故事
      transition(enter-active-class="animate__animated animate__fadeInUp animate__delay-1s")
        b-link(v-if="show" to='/product' @click="$emit('closeContent')") 商品介紹
      transition(enter-active-class="animate__animated animate__fadeInUp animate__delay-1s")
        b-link(v-if="show" to='/member/profile' @click="$emit('closeContent')") 會員專區
      transition(enter-active-class="animate__animated animate__fadeInUp animate__delay-1s")
        b-link(v-if="show" to='/contact' @click="$emit('closeContent')") 意見回饋
</template>

<script>
import logo from '../assets/images/logo.png'
export default {
  props: {
    show: Boolean
  },
  data () {
    return {
      src: logo
    }
  },
  methods: {
    backtohome () {
      this.$bus.$emit('transform')
      this.$emit('closeContent')
    }
  }
}
</script>

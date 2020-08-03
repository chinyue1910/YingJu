<template lang="pug">
  #home
    b-container.px-0(fluid).h-100
      b-row(no-gutters).h-100.flex-column.flex-md-row.flex-nowrap
        b-col(
          :style="{background:`url(${box.src}) no-repeat center/cover`}" cols="3"
          :class="{'col-md-12':box.ishalf,'col-md-6':!box.ishalf}"
          )
          transition(enter-active-class="animate__animated animate__flipInX animate__slow")
            b-link(v-if='show' :to='box.link' :class="{backdrop:isShow}") {{ box.text }}
        b-col.d-flex.flex-column(
          cols="12"
          :class="{'col-md-0':box.ishalf,'col-md-6':!box.ishalf}")
          b-col(
            v-for="(box,index) in boxs"
            :key='index'
            :style="{background:`url(${box.src}) no-repeat center/cover`}"
            cols="3"
            :class="{'col-md-12':box.isdivide,'col-md-6':!box.isthird,'col-md-4':!box.isforth}")
            transition(enter-active-class="animate__animated animate__flipInX animate__slow")
              b-link(v-if='show' :to='box.link' :class="{backdrop:isShow}") {{ box.text }}
          b-col.d-flex.flex-column.flex-md-row(
            cols="6"
            :class="{'col-md-4':!box.isforth}")
            b-col(
              v-for="(box,index) in box1s"
              :key='index'
              :style="{background:`url(${box.src}) no-repeat center/cover`}"
              cols="6"
              :class="{'col-md-12':box.isdivide}")
              transition(enter-active-class="animate__animated animate__flipInX animate__slow")
                b-link(v-if='show' :to="box.link" :class="{backdrop:isShow}") {{ box.text }}
</template>

<script>
import home1 from '../assets/images/home1.jpg'
import home2 from '../assets/images/home2.jpg'
import home3 from '../assets/images/home3.jpg'
import home4 from '../assets/images/home4.jpg'
import home5 from '../assets/images/home5.jpg'
export default {
  data () {
    return {
      box: {
        src: home1,
        link: '/news',
        text: '最新消息',
        ishalf: true
      },
      boxs: [
        {
          src: home2,
          link: '/about',
          text: '菇菇故事',
          isdivide: true,
          isthird: true,
          isforth: true
        },
        {
          src: home3,
          link: '/product',
          text: '商品介紹',
          isdivide: true,
          isthird: true,
          isforth: true
        }
      ],
      box1s: [
        {
          src: home4,
          link: '/member/profile',
          text: '會員專區',
          isdivide: true
        },
        {
          src: home5,
          link: '/contact',
          text: '意見回饋',
          isdivide: true
        }
      ],
      show: false,
      isShow: false
    }
  },
  props: {
    fullwidth: Number
  },
  mounted () {
    this.transform()
  },
  methods: {
    transform () {
      setTimeout(() => {
        this.show = true
      }, 1000)
      setTimeout(() => {
        this.isShow = true
      }, 8000)
      setTimeout(() => {
        this.box.ishalf = !(this.fullwidth >= 768)
      }, 4000)
      setTimeout(() => {
        this.boxs[0].isdivide = !(this.fullwidth >= 768)
        this.boxs[1].isdivide = !(this.fullwidth >= 768)
        this.boxs[0].isthird = !(this.fullwidth >= 768)
        this.boxs[1].isthird = !(this.fullwidth >= 768)
      }, 5000)
      setTimeout(() => {
        this.boxs[0].isforth = !(this.fullwidth >= 768)
        this.boxs[1].isforth = !(this.fullwidth >= 768)
        this.boxs[0].isthird = !this.boxs[0].isthird
        this.boxs[1].isthird = !this.boxs[1].isthird
      }, 6000)
      setTimeout(() => {
        this.box1s[0].isdivide = !(this.fullwidth >= 768)
        this.box1s[1].isdivide = !(this.fullwidth >= 768)
      }, 7000)
    }
  },
  created () {
    this.$bus.$on('transform', msg => {
      this.transform(msg)
    })
  }
}
</script>

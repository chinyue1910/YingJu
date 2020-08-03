<template lang="pug">
  section(:style="{background:`url(${img}) no-repeat fixed center/cover`}")
    svg(height="100%" :style="{transform:'rotate(180deg)',height:'50px'}" fill="#52453c" width="100%" viewBox="0 0 1000 100" preserveAspectRatio="none")
      path(d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z")
    h4 你想要的，我們全都有
    b-container.h-75(fluid)
      b-row.h-100
        b-col.particle(cols="12" sm="6" v-for="(box,index) in boxs" :key="index").d-flex.justify-content-around.align-items-center.flex-wrap
          b-col(cols="12" sm="6").justify-content-center.d-flex.py-1
            .icon
          b-col(cols="12" sm="6").py-1
            h3 {{ box.text }}
            h6 {{ box.descript }}
    svg(height="100%" :style="{transform:'rotate(0deg)',height:'50px'}" fill="#52453c" width="100%" viewBox="0 0 1000 100" preserveAspectRatio="none")
      path(d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z")
</template>

<script>
import img from '../../assets/images/section3.jpg'
export default {
  data () {
    return {
      img: img,
      boxs: [
        {
          text: '特色一',
          descript: '各種大小供你選擇'
        },
        {
          text: '特色二',
          descript: '堅持無農藥'
        },
        {
          text: '特色三',
          descript: '採取有機栽培'
        },
        {
          text: '特色四',
          descript: '水源灌溉來自天然水'
        },
        {
          text: '特色五',
          descript: '朵朵香氣濃郁'
        },
        {
          text: '特色六',
          descript: '品質保證'
        }
      ]
    }
  }
}
</script>

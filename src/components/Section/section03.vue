<template lang="pug">
  section
    svg(height="100%" :style="{transform:'rotate(180deg)',height:'50px'}" fill="#52453c" width="100%" viewBox="0 0 1000 100" preserveAspectRatio="none")
      path(d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z")
    h4 我們的品質
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
export default {
  data () {
    return {
      boxs: [
        {
          text: '特色一',
          descript: '不添加防腐劑'
        },
        {
          text: '特色二',
          descript: '天然香氣直撲而來'
        },
        {
          text: '特色三',
          descript: '經深度烘培'
        },
        {
          text: '特色四',
          descript: '全部純手工製造'
        },
        {
          text: '特色五',
          descript: '接受大量訂單要求'
        },
        {
          text: '特色六',
          descript: '家傳很多代秘密配方'
        }
      ]
    }
  }
}
</script>

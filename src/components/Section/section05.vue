<template lang="pug">
  section
    svg(height="100%" :style="{transform:'rotate(180deg)',height:'50px'}" fill="#52453c" width="100%" viewBox="0 0 1000 100" preserveAspectRatio="none")
      path(d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z")
    h4.py-3 香菇的出生
    b-container
      b-row.h-card(v-for="(box,index) in boxs" :key="index").py-3
        b-col.text-center(
          cols="12"
          md="6"
          :data-aos="animate(index)"
          data-aos-offset="200"
          data-aos-duration="1000"
          )
          b-img(thumbnail :src="box.src")
        b-col.d-flex.align-items-center.px-5(
          cols="12"
          md="6"
          :data-aos="animate(index+1)"
          data-aos-offset="200"
          data-aos-duration="1000"
        )
          h5.mb-0.py-3 {{ box.text }}
    svg(height="100%" :style="{transform:'rotate(0deg)',height:'50px'}" fill="#52453c" width="100%" viewBox="0 0 1000 100" preserveAspectRatio="none")
      path(d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z")
</template>

<script>
import AOS from 'aos'
import 'aos/dist/aos.css'
import img1 from '../../assets/images/section5-1.jpg'
import img2 from '../../assets/images/section5-2.jpg'
import img3 from '../../assets/images/section5-3.jpg'
import img4 from '../../assets/images/section5-4.jpg'
import img5 from '../../assets/images/section5-5.jpg'
import img6 from '../../assets/images/section5-6.jpg'
import img7 from '../../assets/images/section5-7.jpg'
import img8 from '../../assets/images/section5-8.jpg'
import img9 from '../../assets/images/section5-9.jpg'
import img10 from '../../assets/images/section5-10.jpg'
AOS.init()
export default {
  data () {
    return {
      boxs: [
        {
          src: img1,
          text: '香菇包開始進來是黑色的，第一個月後香菇包裡菌絲開始成長變白色，沒變白色的黑色的孢子就是死掉的菌絲，要把一包一包黑色的孢子拿出來'
        },
        {
          src: img2,
          text: '大約4個半月後會明顯地觀察到香菇包變咖啡色，這時候就必須把上半部的袋子打開，準備開始讓它生長'
        },
        {
          src: img3,
          text: '注意溫度與濕度，每天不定時澆水，這個過程很重要，攸關香菇的出菇率以及太空包的健康，如果生長太密集，也必須適時的疏果，才能維持每一朵的品質'
        },
        {
          src: img4,
          text: '香菇從冒出頭到採收，大約需要5-10天的時間，依照溫度來決定，溫度低生長慢，口感Q彈。等待香菇成熟後，在最佳狀態採收下來，才能確保香菇的品質'
        },
        {
          src: img5,
          text: '剪去蒂頭的工作非常耗時間，一切都是人工，無法機械化，必須一朵一朵的剪，常常是六七個小時的重複工作，剪得頭昏眼花'
        },
        {
          src: img6,
          text: '烘乾香菇之前，會先讓香菇洗澎澎，去除雜質以及讓香菇濕潤，後面機器在翻滾的時候香菇表面才比較不會破皮'
        },
        {
          src: img7,
          text: '香菇經由輸送帶，進到香菇專用篩選機，篩選機有大小不同的孔洞，香菇轉耶轉的滾入了適合的位置，便依照大小分級囉'
        },
        {
          src: img8,
          text: '分完大小尺寸後再一藍一藍倒入烤箱盤子上，送入烤箱烤最少22小時，依照氣溫以及香菇含水量來決定起溫，並且每兩小時觀察香菇濕度，微調烤爐溫度。'
        },
        {
          src: img9,
          text: '為了讓每一朵香菇都達到最佳乾燥程度，必須定時打開烤爐，一朵朵的翻面，避免香菇黏在一起，很厚公吧'
        },
        {
          src: img10,
          text: '烤好後要一盤一盤純手工眼力篩選香菇，把不漂亮或破裂的香菇一顆一顆篩選出，菇農兩天一夜的賣力工作，終於完成了乾香菇的製作'
        }
      ]
    }
  },
  methods: {
    animate (index) {
      return (index % 2 === 0) ? 'fade-right' : 'fade-left'
    }
  }
}
</script>

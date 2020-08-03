<template lang="pug">
  section
    b-container(fluid :style="{background:'#52453c'}").text-white
      b-row.py-3
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          h6.mb-0 Copyright &copy; 2020 映筑香菇農場 版權所有
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          vs-icon(icon="local_phone").mr-1
          h6.mb-0 連絡電話：0981-799-090
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          vs-icon(icon="access_time").mr-1
          h6.mb-0 營業時間：周一至周五 08:00 ～ 17:00
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          b-link(href="https://line.me/ti/p/EaSXCUxXeH").mr-1
            font-awesome-icon(:icon=['fab','line'] size="2x" color="white")
          h6.mb-0 ID：0981799090
</template>

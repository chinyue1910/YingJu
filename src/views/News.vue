<template lang="pug">
  #news(:style="{background: `url(${img}) no-repeat fixed center/cover`}")
    b-container
      b-row.flex-column
        b-col(
          v-for="(box,index) in paginatedBoxs"
          :key="index"
          :style="{maxWidth:'100%',borderRadius:'1rem'}"
          @click="box.popupActivo =true"
          ).p-3.mb-3
          .d-flex.flex-wrap.justify-content-between
            b-col.carditem(cols="12" sm="4").px-0
              b-img(:src="box.src")
            b-col.carditem(cols="12" sm="7").d-flex.flex-column.justify-content-around
              h3(:style="{color:'darkgreen'}") {{ box.title }}
              p {{ (box.text.length > 30) ? box.text.substr(0,30) + '...' : box.text }}
              .tag.d-flex.mt-3
                h6.mr-auto {{ box.time }}
                h6 {{ box.tag }}
            vs-popup.holamundo(:title='box.tag' :active.sync='box.popupActivo' button-close-hidden=true)
              b-col(cols="12").d-flex.justify-content-center
                img(:src="box.src" :style="{minWidth:'90%'}")
              b-col(cols="12").p-3
                h1.text-success.text-center {{ box.title }}
              b-col(cols="12")
                p {{ box.text }}
              b-col(cols="12").text-right.text-dark
                | {{ box.time }}
    b-pagination-nav(
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :number-of-pages="numberOfPages"
      :link-gen="linkGen"
      @change="onPageChanged"
      pills
      use-router
      align="center"
      v-if="boxs.length > perPage"
    )

</template>

<script>
import img from '../assets/images/news.jpg'
export default {
  data () {
    return {
      boxs: [],
      paginatedBoxs: this.boxs,
      perPage: 4,
      currentPage: 1,
      img: img
    }
  },
  methods: {
    paginate (pageSize, pageNumber) {
      const boxsToParse = this.boxs.slice().reverse()
      this.paginatedBoxs = boxsToParse.slice(
        pageNumber * pageSize,
        (pageNumber + 1) * pageSize
      )
    },
    onPageChanged (page) {
      this.paginate(this.perPage, page - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    linkGen (pageNum) {
      return pageNum === 1 ? '?' : `?page=${pageNum}`
    }
  },
  computed: {
    totalRows () {
      return this.boxs.length
    },
    numberOfPages () {
      return parseInt(this.totalRows / this.perPage) + 1
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/article')
      .then(response => {
        console.log(response.data.result)
        this.boxs = response.data.result.map(d => {
          return {
            popupActivo: false,
            title: d.title,
            src: process.env.VUE_APP_APIURL + '/article/' + d.name,
            text: d.text,
            time: d.time,
            tag: d.tag
          }
        })
        this.paginate(this.perPage, 0)
      })
  }
}
</script>

<template lang="pug">
  #product
    b-container(fluid).h-50(:style="{background:`url(${uri}) no-repeat center/cover`}")#header
      h1.text-warning Choose Your Love
      svg(height="300%" :style="{transform:'rotate(0deg)',height:'50px'}" fill="white" width="100%" viewBox="0 0 1000 200" preserveAspectRatio="none")
        path(d="M0,0c0,0,152.324,200,500,200S1000,0,1000,0v200H0V0z")
    b-container(v-if="fullwidth >= 768")
      b-row.py-5
        b-col(md="6" lg="4" xl="3" v-for="(box,index) in boxs" :key="index").p-3.d-flex.flex-column.align-items-center
          h4.text-dark.mb-3 {{ box.product }}
          .cardImg
            img(:src="box.src" @click="box.popupActivo=true")
          .cardText.py-3.d-flex.align-items-center.w-100.justify-content-around
            b-button(variant="success" @click="addToCart(box)" :disabled="(box.storage === 0)")
              font-awesome-icon(:icon=['fas','shopping-cart']).mr-1
              | {{ (box.storage === 0) ? '商品已售完' : '加入購物車'}}
          vs-popup.holamundo(:title='box.product' :active.sync='box.popupActivo' button-close-hidden=true)
            b-col(cols="12")
              img(:src="box.src")
            b-col(cols="12").p-3
              p {{ box.descript }}
            b-col(cols="12").d-flex
              h3.text-success.mr-auto 售價 {{ box.price }}
              b-button(variant="info" @click="addToCart(box)" :disabled="(box.storage === 0)") {{ (box.storage === 0) ? '商品已售完' : '加入購物車'}}
    hooper(:settings="hooperSettings" v-else).h-50.p-0
      slide(v-for="(box,index) in boxs" :key="index")
        h4.text-dark.text-center.mb-0 {{ box.product }}
        .img(:style="{background:`url(${box.src}) no-repeat center/cover`}" @click="box.popupActivo=true")
        b-button(variant="success" @click="addToCart(box)" pill).align-self-center
          font-awesome-icon(:icon=['fas','shopping-cart']).mr-1
        vs-popup.holamundo(:title='box.product' :active.sync='box.popupActivo' button-close-hidden=true)
          b-col(cols="12")
            img(:src="box.src")
          b-col(cols="12").p-3
            p {{ box.descript }}
          b-col(cols="12").d-flex
            h3.text-success.mr-auto 售價 {{ box.price }}
            b-button(variant="info" @click="addToCart(box)") 加入購物車
</template>

<script>
import background from '../assets/images/product.jpg'
import { Hooper, Slide } from 'hooper'
import 'hooper/dist/hooper.css'
export default {
  components: {
    Hooper,
    Slide
  },
  props: {
    fullwidth: Number
  },
  data () {
    return {
      uri: background,
      boxs: [],
      hooperSettings: {
        infiniteScroll: true,
        itemsToShow: 3,
        centerMode: true,
        rtl: true
      }
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/product')
      .then(response => {
        this.boxs = response.data.result.map(d => {
          return {
            id: d._id,
            popupActivo: false,
            src: process.env.VUE_APP_APIURL + '/product/' + d.name,
            price: d.price,
            product: d.item,
            descript: d.description,
            storage: d.storage
          }
        })
      })
      .catch(error => {
        this.$vs.notify({
          title: error.response.data.message,
          color: 'danger',
          icon: 'close'
        })
      })
  },
  methods: {
    addToCart (box) {
      if (this.userID.length !== 0) {
        const form = {
          product: box.product,
          src: box.src,
          price: box.price,
          count: 1,
          id: box.id
        }
        this.axios.post(process.env.VUE_APP_APIURL + '/cart/' + this.userID, form)
          .then(response => {
            if (response.data.success) {
              this.$bus.$emit('addCart', response.data.result.cart)
              this.$vs.notify({
                position: 'top-right',
                title: '物品已新增至購物車，點我確認',
                color: 'success',
                icon: 'done',
                click: () => {
                  this.$router.push('/member/Cart')
                }
              })
            }
          })
          .catch(err => {
            this.$vs.notify({
              title: err.response.data.message,
              color: 'danger',
              icon: 'close'
            })
          })
      } else {
        this.$vs.notify({
          title: '請先登入帳號',
          color: 'danger',
          icon: 'close'
        })
      }
    }
  },
  computed: {
    userID () {
      return this.$store.getters.userID
    }
  }
}
</script>

<template lang="pug">
  #cart.bg-white
    b-container(fluid).h-100
      b-row.align-items-center.align-items-lg-end.personal
        b-col.text-center
          h3 購物清單
          h6 查看及購買
      b-row.bg-light.mb-5
        b-table(show-empty stacked='md' :items='items' :fields='fields')
          template(v-slot:cell(product)='row')
            b-col(cols="12" sm="10" md="6")
              img(:src="row.item.src")
            b-col(cols="12" md="4" :style="{fontSize:'1.2rem',wordBreak:'break-word'}").mt-3.mt-md-0.text-success
              | {{ row.value }}
          template(v-slot:cell(price)='row').
            {{ row.value }}
          template(v-slot:cell(count)='row')
            vs-input-number(v-model="row.value" @input="show([$event,row.item])" :max="row.item.max" min=0)
          template(v-slot:cell(total)='row').
            {{ row.item.price * row.item.count }}
          template(v-slot:cell(actions)='row')
            b-button(variant="danger" @click="remove(row.index)").ml-1 刪除
          template(v-slot:empty="scope")
            b-link(:style="{display:'block'}" to="/product").text-center 跟著我去逛逛其他商品吧
      b-row.justify-content-center.m-0.align-items-center
        h4.mb-0 購買總金額：
        h3.text-danger.mb-0 ${{ totalprice }}
        b-btn(variant="warning" @click="popupActivo = true" :disabled="totalprice === 0").ml-3 立即下訂
    vs-popup.holamundo(title='確認下訂' :active.sync='popupActivo' button-close-hidden=true)
      b-col(cols="12").text-center
        h3 您的訂單總金額為
      b-col(cols="12").text-center.my-5
        h1 $ {{ totalprice }}
      b-col(cols="12").text-center
        b-button(variant="success" size="lg" @click="submit").mr-1 送出
        b-button(variant="danger" size="lg" @click="cancel").ml-1 取消
</template>

<script>
export default {
  data () {
    return {
      items: [],
      value: 123,
      fields: [
        { key: 'product', label: '商品', class: 'text-center align-middle flexItem' },
        { key: 'price', label: '單價', class: 'text-center align-middle' },
        { key: 'count', label: '數量', class: 'text-center align-middle' },
        { key: 'total', label: '總計', class: 'text-center align-middle' },
        { key: 'actions', label: '操作', class: 'text-center align-middle' }
      ],
      popupActivo: false
    }
  },
  mounted () {
    this.axios
      .get(process.env.VUE_APP_APIURL + '/profile/' + this.userID)
      .then(response => {
        this.items = response.data.result[0].cart.map(d => {
          return {
            src: d.src,
            product: d.product,
            price: d.price,
            count: d.count,
            id: d.id,
            max: null
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
  computed: {
    userID () {
      return this.$store.getters.userID
    },
    totalprice () {
      let price = 0
      for (const i of this.items) {
        price += (i.price * i.count)
      }
      return price
    }
  },
  methods: {
    changeCart (msg) {
      this.items = msg
      for (const i of this.items) {
        i.max = null
      }
    },
    show (data) {
      data[1].count = parseInt(data[0])
    },
    submit () {
      if (this.items.length === 0) {
        this.$vs.notify({
          title: '請先選購商品',
          color: 'danger',
          icon: 'close'
        })
      } else {
        const form = this.items.map(d => {
          return {
            product: d.product,
            count: d.count,
            id: d.id
          }
        })
        form.push({ totalprice: this.totalprice }, { userId: this.userID })
        this.axios.post(process.env.VUE_APP_APIURL + '/order/' + this.userID, form)
          .then(response => {
            if (response.data.success) {
              this.items = []
              this.popupActivo = false
              this.$swal({
                title: '訂單已送出',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: '確定'
              })
            }
          })
          .catch(err => {
            this.popupActivo = false
            this.$swal({
              title: err.response.data.message.status,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
            if (err.response.data.message.status === '商品庫存不足') {
              this.axios.get(process.env.VUE_APP_APIURL + '/product')
                .then(response => {
                  for (const i in this.items) {
                    this.items[i].max = err.response.data.message.product[i].storage
                    this.items[i].count = err.response.data.message.product[i].storage
                  }
                })
            }
          })
      }
    },
    cancel () {
      this.popupActivo = false
    },
    remove (index) {
      this.axios.patch(process.env.VUE_APP_APIURL + '/cart/' + this.userID, { index: index })
        .then(response => {
          this.items = response.data.result.cart.map(d => {
            return {
              src: d.src,
              product: d.product,
              price: d.price,
              count: d.count
            }
          })
        })
        .catch(err => {
          this.$vs.notify({
            title: err.response.data.message,
            color: 'danger',
            icon: 'close'
          })
        })
    }
  },
  created () {
    this.$bus.$on('addCart', msg => {
      this.changeCart(msg)
    })
  }
}
</script>

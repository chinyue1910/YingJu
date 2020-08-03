<template lang="pug">
  #track.bg-white
    b-container.pt-5
      b-table(
        :items="items"
        :fields="fields"
        stacked='md'
        show-empty
        thead-tr-class="bg-info"
      )
        template(v-slot:cell(checkbox)="row")
          | {{ row.value === 'completed' ? '已送達' : row.value === 'sending' ? '寄送中' : '等待付款' }}
        template(v-slot:cell(delete)="row")
          b-button(variant="danger" :disabled="(row.item.checkbox !== 'waiting')"  @click="cancel([row.item._id,row.index])") 取消訂單
        template(v-slot:cell(order)="row")
          b-button(size="sm" @click="row.toggleDetails" variant="info").
            {{ row.detailsShowing ? '隱藏' : '顯示' }}詳細資料
        template(v-slot:row-details="row")
          b-table(:items="row.item.order" :fields="fields2" thead-tr-class="bg-secondary").bg-light
        template(v-slot:empty="scope")
          h4.text-center 目前還沒有任何訂單喔
</template>

<script>
export default {
  data () {
    return {
      items: [],
      fields: [
        { key: '_id', label: '訂單編號', sortable: false, class: 'text-center align-middle' },
        { key: 'order', label: '訂單內容', sortable: false, class: 'text-center align-middle' },
        { key: 'total', label: '總金額', sortable: false, class: 'text-center align-middle' },
        { key: 'checkbox', label: '目前狀態', sortable: false, class: 'text-center align-middle' },
        { key: 'delete', label: '動作', sortable: false, class: 'text-center align-middle' }
      ],
      fields2: [
        { key: 'product', label: '商品名稱', class: 'text-center align-middle' },
        { key: 'count', label: '數量', class: 'text-center align-middle' }
      ]
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/track/' + this.userID)
      .then(response => {
        this.items = response.data.result
        for (const i of this.items) {
          i._rowVariant = (i.checkbox === 'completed') ? 'dark' : 'info'
        }
      })
  },
  computed: {
    userID () {
      return this.$store.getters.userID
    }
  },
  methods: {
    cancel (data) {
      this.$swal({
        title: '確定取消訂單嗎?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      })
        .then(result => {
          if (result.value) {
            this.axios.delete(process.env.VUE_APP_APIURL + '/track/' + data[0])
            this.items.splice(data[1], 1)
          }
        }
        )
    }
  }
}
</script>

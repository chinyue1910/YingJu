<template lang="pug">
  #order
    b-container.pt-5
      b-row.mb-3.justify-content-end.m-0
        b-form-select(v-model="filter" :options="selectedoptions" :style="{width:'auto'}")
        b-button.ml-3(variant="danger" @click="save") 保存
      b-table(
        :filter="filter"
        :filterIncludedFields="['checkbox']"
        show-empty
        empty-text="目前沒有任何訂單"
        :items='items'
        :fields='fields'
        stacked='sm'
        thead-tr-class="bg-info")
        template(v-slot:cell(order)="row")
          b-button(size="sm" @click="row.toggleDetails" variant="info").
            {{ row.detailsShowing ? '隱藏' : '顯示' }}詳細資料
        template(v-slot:cell(checkbox)="row")
          b-form-radio-group(:options='options' v-model="row.item.checkbox")
        template(v-slot:row-details="row")
          b-table(:items="row.item.order" :fields="fields2" dark thead-tr-class="bg-danger")
        template(v-slot:emptyfiltered="scope")
          h5.text-center.text-danger 目前沒有任何此選項的內容

</template>

<script>
export default {
  data () {
    return {
      filter: null,
      items: [],
      fields: [
        { key: 'name', label: '姓名', sortable: false, class: 'text-center align-middle' },
        { key: 'tel', label: '手機', sortable: false, class: 'text-center align-middle' },
        { key: 'order', label: '訂單內容', sortable: false, class: 'text-center align-middle' },
        { key: 'total', label: '總金額', sortable: true, class: 'text-center align-middle' },
        { key: 'checkbox', label: '目前狀態', sortable: true, class: 'text-center align-middle' }
      ],
      fields2: [
        { key: 'product', label: '商品名稱', class: 'text-center align-middle' },
        { key: 'count', label: '數量', class: 'text-center align-middle' }
      ],
      options: [
        { text: '等待匯款', value: 'waiting' },
        { text: '寄送中', value: 'sending' },
        { text: '已送達', value: 'completed' }
      ],
      selectedoptions: [
        { text: '請選擇過濾方式', value: null },
        { text: '等待付款', value: 'waiting' },
        { text: '寄送中', value: 'sending' },
        { text: '已送達', value: 'completed' }
      ]
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/order')
      .then(response => {
        this.items = response.data.result.map(d => {
          return {
            name: d.name,
            tel: d.tel,
            order: d.order,
            total: d.total,
            checkbox: d.checkbox,
            _rowVariant: (d.checkbox === 'completed') ? 'dark' : 'info',
            userId: d.userId
          }
        }).slice().reverse()
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
    save () {
      this.axios.patch(process.env.VUE_APP_APIURL + '/order', this.items.slice().reverse())
        .then(response => {
          if (response.data.success) {
            this.items = response.data.result.map(d => {
              return {
                name: d.name,
                tel: d.tel,
                order: d.order,
                total: d.total,
                checkbox: d.checkbox,
                _rowVariant: (d.checkbox === 'completed') ? 'dark' : 'info',
                userId: d.userId
              }
            }).slice().reverse()
            this.$swal({
              title: '保存成功',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
          }
        })
        .catch(error => {
          this.$swal({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '確定'
          })
        })
    }
  }
}
</script>

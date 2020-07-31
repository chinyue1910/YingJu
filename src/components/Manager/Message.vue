<template lang="pug">
  #message.bg-white
    b-container.pt-5
      b-table(
        show-empty
        striped
        empty-text="目前沒有任何意見"
        :items='items'
        :fields='fields'
        stacked='sm'
        thead-tr-class="bg-info")
        template(v-slot:cell(text)="row")
          b-button(size="sm" @click="row.toggleDetails" variant="info").
            {{ row.detailsShowing ? '隱藏' : '顯示' }}詳細資料
        template(v-slot:row-details="row")
          b-card.
            {{ row.item.text }}
</template>

<script>
export default {
  data () {
    return {
      items: [],
      fields: [
        { key: 'name', label: '姓名', sortable: false, class: 'text-center align-middle' },
        { key: 'tel', label: '電話', sortable: false, class: 'text-center align-middle' },
        { key: 'email', label: 'E-Mail', sortable: false, class: 'text-center align-middle' },
        { key: 'text', label: '意見', sortable: false, class: 'text-center align-middle' },
        { key: 'content', label: '時間', sortable: true, class: 'text-center align-middle' }
      ]
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/message')
      .then(response => {
        const result = response.data.result
        for (const i of result) {
          const limit = i.time = parseInt((Date.now() - i.time) / 1000)
          if (limit < 60) {
            i.content = '剛剛'
          } else if (limit >= 60 && limit < 3600) {
            i.content = Math.floor(limit / 60) + '分鐘前'
          } else if (limit >= 3600 && limit < 86400) {
            i.content = Math.floor(limit / 3600) + '小時前'
          } else if (limit >= 86400 && limit < 2592000) {
            i.content = Math.floor(limit / 86400) + '天前'
          } else if (limit >= 2592000 && limit < 31104000) {
            i.content = Math.floor(limit / 2592000) + '個月前'
          } else {
            i.content = '超過一個月前'
          }
        }
        this.items = result.slice().reverse()
      })
      .catch(error => {
        this.$vs.notify({
          title: error.response.data.message,
          color: 'danger',
          icon: 'close'
        })
      })
  }
}
</script>

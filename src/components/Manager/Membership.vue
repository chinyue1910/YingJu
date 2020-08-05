<template lang="pug">
  #membership.bg-white
    b-container.pt-5(fluid)
      b-table(
        show-empty
        empty-text="目前沒有任何會員"
        striped
        stacked='md'
        :items='users'
        :fields='fields'
        thead-tr-class="bg-info")
        template(v-slot:cell(address)="row")
          | {{ (row.item.address.length === 0) ? '沒有提供地址資訊' : row.item.address }}
        template(v-slot:cell(action)="row")
          b-button(variant="danger" @click="cancel([row.item._id,row.index])") 刪除
</template>

<script>
export default {
  data () {
    return {
      users: [],
      fields: [
        { key: 'name', label: '姓名', class: 'text-center align-middle flexItem' },
        { key: 'tel', label: '電話', class: 'text-center align-middle' },
        { key: 'account', label: '信箱', class: 'text-center align-middle' },
        { key: 'address', label: '地址', class: 'text-center align-middle' },
        { key: 'action', label: '操作', class: 'text-center align-middle' }
      ]
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/membership')
      .then(response => {
        this.users = response.data.resultNew
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
    cancel (data) {
      this.$swal({
        title: '是否確定刪除該帳號',
        icon: 'question',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確定',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: '取消'
      }).then(result => {
        if (result.value) {
          this.axios.delete(process.env.VUE_APP_APIURL + '/membership/' + data[0])
            .then(response => {
              if (response.data.success) {
                this.$swal({
                  title: '帳號已刪除',
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: '確定'
                })
              }
            })
            .catch(e => {
              this.$swal({
                title: e.response.data.message,
                icon: 'danger',
                confirmButtonColor: '#3085d6',
                confirmButtonText: '確定'
              })
            })
        }
      })
    }
  }
}
</script>

<template lang="pug">
  #membership.bg-white
    b-container.pt-5
      b-table(
        show-empty
        empty-text="目前沒有任何會員"
        striped
        stacked='md'
        :items='users'
        :fields='fields'
        thead-tr-class="bg-info")
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
        { key: 'address', label: '地址', class: 'text-center align-middle' }
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
  }
}
</script>

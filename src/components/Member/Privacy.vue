<template lang="pug">
  #privacy.bg-white
    b-container.h-100
      b-row.align-items-center.align-items-lg-end.personal
        b-col.text-center
          h3 隱私資訊
          h6 為了保護你帳號的安全，請不要分享你的密碼給其他人
      b-row.h-50
        b-col
          b-form.h-100.d-flex.flex-column.justify-content-center.align-items-center(@submit="submit")
            b-form-group.w-50(
              v-for="(item,index) in inputs"
              :key="index"
              :label="item.label"
              :label-for="`input-`+item.id"
            )
              b-form-input(
                required
                :id="`input-`+item.id"
                type="password"
                :state="item.state"
                v-model="item.model"
              )
              b-form-invalid-feedback(:state='item.state')
                | {{ item.warning }}
            b-btn(type='submit' variant="success" :disabled="disabled") 送出
</template>
<script>
export default {
  data () {
    return {
      inputs: [
        { label: '舊的密碼', id: '1', model: '' },
        { label: '新密碼', id: '2', model: '', state: null, warning: '密碼字數少於 6 字元' },
        { label: '密碼確認', id: '3', model: '', state: null, warning: '輸入密碼與上面不符' }
      ]
    }
  },
  methods: {
    submit (e) {
      e.preventDefault()
      this.axios.patch(process.env.VUE_APP_APIURL + '/privacy/' + this.userID, this.form)
        .then(response => {
          if (response.data.success) {
            for (const i of this.inputs) {
              i.model = ''
            }
            this.$swal({
              title: '修改成功',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
          }
        }).catch(error => {
          for (const i of this.inputs) {
            i.model = ''
          }
          this.$swal({
            title: error.response.data.message,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '確定'
          })
        })
    }
  },
  computed: {
    disabled () {
      return (this.form.password !== this.form.newconfirm || this.form.password.length < 6)
    },
    form () {
      return {
        old: this.inputs[0].model,
        password: this.inputs[1].model,
        newconfirm: this.inputs[2].model
      }
    },
    userID () {
      return this.$store.getters.userID
    }
  },
  watch: {
    form: {
      deep: true,
      handler (value) {
        this.inputs[1].state = (value.password.length === 0) ? null : (value.password.length >= 6)
        this.inputs[2].state = (value.password.length === 0 && value.newconfirm.length === 0) ? null : (value.password === value.newconfirm)
      }
    }
  }
}
</script>

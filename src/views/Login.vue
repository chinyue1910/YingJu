<template lang="pug">
  #login
    b-container(:style="{background: 'rgba(0,0,0,0.8)',borderRadius: '1rem'}").p-0.mx-1.mx-sm-auto
      b-row.align-items-center.justify-content-between.m-0
        b-col.pb-5.pb-lg-0.d-flex.flex-column.align-items-center(cols="12" lg="6")
          font-awesome-icon(:icon=['fas','user-circle'] size="4x" color="white")
          b-form.d-flex.flex-column(@submit="submit")
            b-form-group(
              v-for="(item,index) in inputs"
              :key="index"
              :label="item.label"
              :label-for="item.id"
            )
              b-form-input(
                :id="item.id"
                :type="item.type"
                required
                :placeholder="item.placeholder"
                v-model="form[item.id]"
              )
            b-btn(variant="success" type="submit").mt-3.p-1 登入
            b-link.align-self-center.mt-3 Forgot Password？
        b-col.pt-5.pt-lg-0(cols="12" lg="6").d-flex.flex-column.align-items-center
          b-btn(variant="primary").mb-3
            b-col(cols="2")
              font-awesome-icon(:icon=['fab','facebook-f'] size="1x")
            b-col(cols="10")
              | Login with Facebook
          b-btn(variant="light")
            b-col(cols="2")
              font-awesome-icon(:icon=['fab','google'] size="1x")
            b-col(cols="10")
              | Login with Google
      .footer.text-center.p-3
        | Need an account?
        b-link(to="/sign").ml-1 Sign up now!
</template>

<script>
export default {
  data () {
    return {
      form: {
        account: '',
        password: ''
      },
      inputs: [
        {
          label: '帳號', id: 'account', type: 'email', placeholder: '請輸入電子郵件'
        },
        {
          label: '密碼', id: 'password', type: 'password', placeholder: '請輸入密碼'
        }
      ]
    }
  },
  methods: {
    submit (e) {
      e.preventDefault()
      this.axios.post(process.env.VUE_APP_APIURL + '/login', this.form)
        .then(response => {
          const data = response.data
          if (data.success) {
            this.$swal({
              title: '登入成功',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            }).then(result => {
              if (result.value || result.isDismissed) {
                this.$store.commit('adduser', [data.result[0].name, data.result[0].account, data.result[0]._id])
                this.$router.push('/member/profile')
              }
            })
          } else {
            this.$swal({
              title: data.message,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
          }
          this.form.account = ''
          this.form.password = ''
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

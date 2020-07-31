<template lang="pug">
  #sign
    b-container.d-flex.justify-content-center
      b-row.flex-column.align-items-center(:style="{background: 'rgba(0,0,0,0.8)',borderRadius: '1rem'}")
        font-awesome-icon.logo(:icon=['fas','user-circle'] size="5x" color="white")
        b-form(@submit="submit")
          b-form-group(
            v-for="(item,index) in inputs"
            :key="index"
            :label="item.label"
            :label-for="item.id"
          )
            b-form-input(
              :id="item.id"
              :type="item.type"
              :state="item.state"
              required
              :placeholder="item.placeholder"
              v-model="item.model"
            )
            b-form-invalid-feedback(:state='item.state')
              | {{ item.feedback }}
          b-btn(variant="success" type="submit" :disabled="disabled").mt-3 註冊
</template>

<script>
export default {
  data () {
    return {
      disabled: false,
      passwordconfirm: '',
      inputs: [
        {
          label: '帳號', id: 'account', type: 'email', placeholder: '請輸入電子郵件', model: ''
        },
        {
          label: '密碼', id: 'password', type: 'password', placeholder: '請輸入密碼', state: null, feedback: '密碼字數少於 6 字元', model: ''
        },
        {
          label: '密碼確認', id: 'passwordconfirm', type: 'password', placeholder: '請再次輸入密碼', state: null, feedback: '輸入密碼與上面不符', model: ''
        },
        {
          label: '姓名', id: 'name', type: 'text', placeholder: '請輸入姓名', model: ''
        },
        {
          label: '手機', id: 'tel', type: 'tel', placeholder: '請輸入手機號碼', state: null, feedback: '手機號碼格式錯誤', model: ''
        }
      ]
    }
  },
  watch: {
    form: {
      deep: true,
      handler (value) {
        const phonenumber = /^09/
        this.inputs[1].state = (value.password.length === 0) ? null : (value.password.length >= 6)
        this.inputs[2].state = (value.password.length === 0 && value.passwordconfirm.length === 0) ? null : (value.password === value.passwordconfirm)
        this.inputs[4].state = (value.tel.length === 0) ? null : (phonenumber.test(value.tel) && value.tel.length === 10)
        this.disabled = (value.password !== value.passwordconfirm || value.password < 6 || !phonenumber.test(value.tel) || value.tel.length !== 10)
      }
    }
  },
  methods: {
    submit (e) {
      e.preventDefault()
      this.axios.post(process.env.VUE_APP_APIURL + '/users', this.form)
        .then(response => {
          const data = response.data
          if (data.success) {
            this.$swal({
              title: '註冊成功',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
            this.$router.push('/login')
          } else {
            this.$swal({
              title: data.message,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
          }
          for (const i of this.inputs) {
            i.model = ''
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
  },
  computed: {
    form () {
      return {
        account: this.inputs[0].model,
        password: this.inputs[1].model,
        passwordconfirm: this.inputs[2].model,
        name: this.inputs[3].model,
        tel: this.inputs[4].model,
        address: '尚未有地址'
      }
    }
  }
}
</script>

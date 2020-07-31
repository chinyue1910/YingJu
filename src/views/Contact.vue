<template lang="pug">
  #contact
    b-container(fluid).h-100
      b-row.h-100.flex-row-reverse
        b-col.d-flex.align-items-center.mb-3(cols="12" lg="6")
          img(src="https://picsum.photos/1920/1080/?random=95")
        b-col.d-flex.justify-content-center.align-items-center(cols="12" lg="6")
          b-form.w-75.d-flex.flex-column(@submit="submit")
            b-form-group(
              v-for="(box,index) in boxs"
              :key="index"
              :label="box.label"
              :label-for="box.id"
            )
              b-form-input(
                :id="box.id"
                :type="box.type"
                :required="box.required"
                :state="box.state"
                :placeholder="box.placeholder"
                v-model="form[box.id]"
              )
              b-form-invalid-feedback(:state='box.state')
                | {{ box.feedback }}
            b-form-group(
              label="意見欄"
              label-for="textarea"
            )
              b-form-textarea(
                id="textarea"
                rows="3"
                max-rows="3"
                v-model="form.text"
                required
                maxlength="100"
              )
            b-btn.mt-3(variant="success" type="submit" :disabled="disabled") 提交
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        email: '',
        tel: '',
        text: '',
        checked: false
      },
      disabled: false,
      boxs: [
        { required: true, label: 'Name', id: 'name', type: 'text', placeholder: '請輸入姓名' },
        { required: true, label: 'Email', id: 'email', type: 'email', placeholder: '請輸入電子郵件', state: null },
        { required: false, label: 'CellPhone', id: 'tel', type: 'tel', placeholder: '請輸入手機號碼', feedback: '手機號碼格式錯誤', state: null }
      ]
    }
  },
  methods: {
    submit (e) {
      e.preventDefault()
      const form = this.form
      form.time = Date.now()
      this.axios.post(process.env.VUE_APP_APIURL + '/message', form)
        .then(response => {
          console.log(response.data.result)
          this.$swal({
            title: '送出成功',
            text: '你的意見我們已收到，之後會有專員為你服務',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '確定'
          })
          for (const i of Object.keys(this.form)) {
            this.form[i] = ''
            this.form.checked = false
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
  watch: {
    form: {
      deep: true,
      handler (value) {
        const phonenumber = /^09/
        this.boxs[2].state = (value.tel.length === 0) ? null : (phonenumber.test(value.tel) && value.tel.length === 10)
        this.disabled = (value.tel.length === 0) ? false : (!phonenumber.test(value.tel) || value.tel.length !== 10)
      }
    }
  }
}
</script>

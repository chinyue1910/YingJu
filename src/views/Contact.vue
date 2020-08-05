<template lang="pug">
  #contact
    b-container(fluid).h-75
      b-row.h-100.flex-row-reverse
        b-col.d-flex.align-items-center.mb-3(cols="12" lg="6").justify-content-center
          b-img(:src="img")
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
    b-container(fluid).footer.text-light
      b-row.py-3
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          h6.mb-0 Copyright &copy; 2020 映筑香菇農場 圖片取自網路
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          vs-icon(icon="local_phone").mr-1
          h6.mb-0 連絡電話：0981-799-090
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          vs-icon(icon="access_time").mr-1
          h6.mb-0 營業時間：周一至周五 08:00 ～ 17:00
        b-col(cols="12" md="6" xl="3").d-flex.align-items-center.justify-content-lg-center.pt-1
          b-link(href="https://line.me/ti/p/EaSXCUxXeH").mr-1
            font-awesome-icon(:icon=['fab','line'] size="2x" color="white")
          h6.mb-0 ID：0981799090
</template>

<script>
import img from '../assets/images/contact.jpg'
export default {
  data () {
    return {
      img: img,
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

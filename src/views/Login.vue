<template lang="pug">
  #login(:style="{background: `url(${img}) no-repeat fixed center/cover`}")
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
            b-link.align-self-center.mt-3(@click="getpassword") 忘記密碼？
        b-col.pt-5.pt-lg-0(cols="12" lg="6").d-flex.flex-column.align-items-center
          b-btn(variant="primary" @click="fblogin").mb-3
            b-col(cols="2")
              font-awesome-icon(:icon=['fab','facebook-f'] size="1x")
            b-col(cols="10")
              | Login with Facebook
          b-btn(variant="light")
            b-col(cols="2")
              font-awesome-icon(:icon=['fab','google'] size="1x")
            b-col(cols="10")
              | Login with Google
      .footer.text-center.py-3
        | Need an account?
        b-link(to="/sign").ml-1 立即註冊!
    vs-popup(title="忘記密碼" :active.sync='edit' button-close-hidden=true @close="bringBack")
      b-form(@submit.prevent="submitEmail").w-100.text-center
        b-form-group(
          label="請輸入註冊時的 E-Mail"
          label-for="forgot"
        )
          b-form-input(
            id="forgot"
            v-model="forgot"
            required
            type="email"
          )
        b-row.m-0.justify-content-center
          b-button(variant="success" type="submit").mr-1 送出
          b-button(variant="danger" @click="cancel").ml-1 取消
      vs-popup(title="提醒" :active.sync='edit2' button-close-hidden=true @close="edit=false")
        h4 新的密碼已送出，請登入後立即更改密碼以保護你的隱私
</template>

<script>
import img from '../assets/images/login.jpg'
export default {
  data () {
    return {
      img: img,
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
      ],
      edit: false,
      edit2: false,
      forgot: ''
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
    },
    getpassword () {
      this.edit = true
    },
    cancel () {
      this.edit = false
      this.forgot = ''
    },
    bringBack () {
      this.forgot = ''
    },
    async submitEmail () {
      this.axios.post(process.env.VUE_APP_APIURL + '/send', { email: this.forgot })
        .then(response => {
          if (response.data.success) {
            this.edit2 = true
          }
        })
        .catch(error => {
          this.edit = false
          this.$swal({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '確定'
          })
        })
    },
    async fblogin () {
      window.FB.login(response => {
        window.FB.api('/me?fields=name,id,email,picture', response => {
          const fbform = {
            account: response.email,
            password: response.id,
            tel: '09' + response.id.substr(0, 8),
            name: response.name,
            address: '',
            profileImg: 'http://graph.facebook.com/' + response.id + '/picture?type=large'
          }
          console.log(fbform)
          this.axios.post(process.env.VUE_APP_APIURL + '/fblogin', fbform)
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
                    this.$store.commit('adduser', [data.result.name, data.result.account, data.result._id])
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
        })
      }, {
        scope: 'email, public_profile',
        return_scopes: true
      })
    }
  }
}
</script>

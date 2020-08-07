<template lang="pug">
  #profile.bg-white
    b-container(fluid).h-100
      b-row.align-items-center.align-items-xl-end.personal
        b-col.text-center
          h3 個人資訊
          h6 管理你的檔案以保護你的帳戶
      b-row.detail.flex-column.flex-xl-row.flex-nowrap.align-items-center.justify-content-around.m-0
        b-col.size(xl="4").text-center.d-flex.flex-column.align-items-center.justify-content-center
          img-inputer.h-100.w-100(
            v-model='file'
            no-mask
            :img-src="src"
            theme='light'
            accept="image/*"
            :max-size="1024"
            placeholder="請選擇或拖曳圖片至此"
            icon="img"
            @onChange="upload"
            @onExceed="exceed"
            :style="{maxWidth:'30vh',minHeight:'30vh',height:'30vh',borderRadius:'50%',overflow:'hidden'}")
        b-col.size(xl="8")
          vs-popup.holamundo(title="個人資訊" :active.sync='edit' button-close-hidden=true @close="bringback")
            b-form.d-flex.flex-column.w-100.justify-content-center(@submit="submit")
              b-form-group.w-100(
                v-for="(input,index) in boxs.inputs"
                :key="index"
                :label="input.label"
                :label-for="input.id"
                label-cols="2"
                label-class="text-center"
              )
                b-form-input(:type="input.type" :id="input.id" v-model="input.model" :required="input.required" :state="input.state")
              b-row.m-0.justify-content-center
                b-button(variant="success" type="submit" :disabled="disabled").mr-1 送出
                b-button(variant="danger" @click="cancel").ml-1 取消
          b-row(v-for="(input,index) in boxs.inputs" :key="index").py-3
            b-col.text-success.text-center {{ input.label }}
            b-col {{ (input.initial.length === 0) ? '尚未有地址資訊' :(input.initial.length >10) ? input.initial.substr(0,10)+ '...' :input.initial.includes('--------') ? '請輸入手機號碼' : input.initial }}
          b-row.py-3
            b-col.text-success.text-center {{ (boxs.email === undefined) ? "" :boxs.email.label }}
            b-col {{ (boxs.email === undefined) ? "" :boxs.email.initial }}
          b-row.justify-content-center.my-5
            b-button(variant="primary" @click="edit=true") 更改資料
</template>

<script>
export default {
  data () {
    return {
      edit: false,
      disabled: false,
      boxs: [],
      file: null
    }
  },
  methods: {
    exceed () {
      this.$vs.notify({
        title: '檔案大小不能超過 1 MB',
        color: 'danger',
        icon: 'close'
      })
    },
    upload () {
      if (this.file === null || this.file.size >= 1024 * 1024 || !this.file.type.includes('image')) {
        this.$vs.notify({
          title: '檔案格式不符',
          color: 'danger',
          icon: 'close'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.file)
        this.axios.post(process.env.VUE_APP_APIURL + '/profile/image/' + this.userID, fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            const data = response.data.resultnew
            this.$vs.notify({
              title: '圖片更改成功',
              color: 'success',
              icon: 'done'
            })
            this.$bus.$emit('sendsrc', data.src)
          })
          .catch(error => {
            this.$vs.notify({
              title: error.response.data.message,
              color: 'danger',
              icon: 'close'
            })
          })
      }
    },
    submit (e) {
      e.preventDefault()
      this.axios.patch(process.env.VUE_APP_APIURL + '/profile/' + this.userID, this.form)
        .then(response => {
          if (response.data.success) {
            const d = response.data.result
            this.boxs = {
              inputs: [
                { type: 'text', label: '姓名', id: 'name', model: d.name, initial: d.name, state: null, required: true },
                { type: 'tel', label: '電話', id: 'tel', model: d.tel, initial: d.tel, state: null, required: true },
                { type: 'text', label: '地址', id: 'address', model: d.address, initial: d.address, required: false }
              ],
              email: { label: 'E-mail', id: '4', initial: d.account },
              src: d.src
            }
            this.$store.commit('adduser', [d.name, d.account, d._id])
            this.$swal({
              title: '修改成功',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '確定'
            })
          }
        }).catch(error => {
          this.$swal({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '確定'
          })
        })
      this.edit = false
    },
    cancel () {
      this.edit = false
      for (const i of this.boxs.inputs) {
        i.model = i.initial
      }
    },
    bringback () {
      for (const i of this.boxs.inputs) {
        i.model = i.initial
      }
    }
  },
  computed: {
    form () {
      return (this.boxs.inputs !== undefined) ? {
        name: this.boxs.inputs[0].model,
        tel: this.boxs.inputs[1].model,
        address: this.boxs.inputs[2].model
      } : ''
    },
    userID () {
      return this.$store.getters.userID
    },
    src () {
      const url = process.env.VUE_APP_APIURL + '/profile/image/' + this.boxs.src
      return (this.boxs.src === undefined) ? null : (this.boxs.src.includes('http')) ? this.boxs.src : url
    }
  },
  watch: {
    form: {
      deep: true,
      handler (value) {
        const phonenumber = /^09/
        this.boxs.inputs[0].state = (value.name.length !== 0)
        this.boxs.inputs[1].state = (value.tel.length === 0) ? null : (phonenumber.test(value.tel) && value.tel.length === 10)
        this.disabled = (!this.boxs.inputs[0].state || !this.boxs.inputs[1].state)
      }
    }
  },
  mounted () {
    this.axios
      .get(process.env.VUE_APP_APIURL + '/profile/' + this.userID)
      .then(response => {
        const d = response.data.result[0]
        this.boxs = {
          inputs: [
            { type: 'text', label: '姓名', id: 'name', model: d.name, initial: d.name, state: null, required: true },
            { type: 'tel', label: '電話', id: 'tel', model: d.tel, initial: d.tel, state: null, required: true },
            { type: 'text', label: '地址', id: 'address', model: d.address, initial: d.address, required: false }
          ],
          email: { label: 'E-mail', id: 'account', initial: d.account },
          src: d.src
        }
        console.log(this.boxs)
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

<template lang="pug">
  #article.bg-white
    b-container.pt-3
      b-row
        b-form.w-100(@submit="submit").d-flex.flex-wrap.justify-content-center
          b-col(cols="12").d-lg-flex
            b-col
              b-form-group(
                label="標題"
                label-for="title"
                :state="state"
              )
                b-form-input(
                  id="title"
                  v-model="form.title"
                  required
                )
            b-col
              b-form-group(
                label="類別"
                label-for="type"
              )
                b-form-select(
                  id="type"
                  :options="options"
                  v-model="form.select"
                  required
                )
          b-col(cols="12").py-3.d-flex.flex-wrap
            b-col(cols="12" sm="6").py-3
              img-inputer.h-100.w-100(
                v-model='form.file'
                no-mask=true
                theme='light'
                accept="image/*"
                :max-size="1024"
                placeholder="請選擇或拖曳圖片至此"
                icon="img"
                :style="{maxWidth:'100%',minHeight:'150px'}")
            b-col(cols="12" sm="6")
              b-form-group(
                label="內容詳情"
                label-for="description"
              )
                b-form-textarea(
                  id="description"
                  v-model="form.text"
                  rows="6"
                  max-rows="6"
                  required
                )
          b-col(cols="12")
            b-button(type="submit" variant="success" :style="{flexBasis:'70px'}").w-100 發文
    b-container
      b-row.flex-column
        b-col(
          v-for="(box,index) in boxs"
          :key="index"
          :style="{maxWidth:'100%'}"
          ).p-3.mb-3
          .d-flex(:style="{border:'10px solid rgba(0,0,0,0.5)'}").flex-wrap.justify-content-between
            b-col.carditem(cols="12" md="4").px-0
              b-img(:src="box.src")
            b-col.carditem(cols="12" md="7").d-flex.flex-column.justify-content-around
              vs-popup.holamundo(@close="bringback(box)" title="商品資訊" :active.sync='box.edit' button-close-hidden=true)
                b-form(@submit.prevent="submitItem(box)").w-100.text-center
                  b-form-group(
                    label="標題"
                    label-for="changeTitle"
                    label-cols="2"
                  )
                    b-form-input(
                      id="changeTitle"
                      v-model="box.title.model"
                      required
                      type="text"
                    )
                  b-form-group(
                    label="內容詳情"
                    label-for="changeText"
                    label-cols="2"
                  )
                    b-form-textarea(
                      id="changeText"
                      v-model="box.text.model"
                      required
                    )
                  b-form-group(
                    label="類別"
                    label-for="changeTag"
                    label-cols="2"
                  )
                    b-form-select(
                      id="changeTag"
                      v-model="box.tag.model"
                      required
                      :options="options"
                    )
                  b-row.m-0.justify-content-center
                    b-button(variant="success" type="submit").mr-1 送出
                    b-button(variant="danger" @click="cancel(box)").ml-1 取消
              .row.m-0
                h3(:style="{color:'darkgreen'}").mr-auto {{ box.title.detail }}
                h6 {{ box.tag.detail }}
              p.mt-3 {{ box.text.detail }}
              b-row.justify-content-center
                b-button(variant="primary" @click="edit(box)") 更改資料
                b-button.ml-3(variant="danger" @click="deleteitem(index)") 刪除貼文
</template>

<script>
export default {
  data () {
    return {
      form: {
        file: null,
        text: '',
        title: '',
        select: null
      },
      boxs: [],
      state: null,
      options: [
        { text: '請選擇類別', value: null },
        { text: '活動', value: '活動' },
        { text: '促銷', value: '促銷' },
        { text: '資訊', value: '資訊' },
        { text: '限時優惠', value: '限時優惠' },
        { text: '公告', value: '公告' }
      ]
    }
  },
  methods: {
    edit (box) {
      box.edit = true
    },
    cancel (box) {
      box.edit = false
    },
    bringback (box) {
      for (const i of this.box.inputs) {
        i.model = i.detail
      }
    },
    submit (e) {
      e.preventDefault()
      const now = new Date()
      if (this.form.file === null || this.form.file.size >= 1024 * 1024 || !this.form.file.type.includes('image')) {
        this.$vs.notify({
          title: '檔案格式不符',
          color: 'danger',
          icon: 'close'
        })
      } else {
        const fd = new FormData()
        const month = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)
        const date = now.getDate() > 9 ? now.getDate() : '0' + now.getDate()
        fd.append('image', this.form.file)
        fd.append('title', this.form.title)
        fd.append('text', this.form.text)
        fd.append('time', now.getFullYear() + '/' + month + '/' + date)
        fd.append('tag', this.form.select)
        this.axios.post(process.env.VUE_APP_APIURL + '/article', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            const d = response.data.result
            this.boxs.push({
              edit: false,
              id: d._id,
              src: process.env.VUE_APP_APIURL + '/article/' + d.name,
              time: d.time,
              title: { detail: d.title, model: d.title },
              text: { detail: d.text, model: d.text },
              tag: { detail: d.tag, model: d.tag }
            })
            this.form.file = null
            this.form.text = ''
            this.form.title = ''
            this.form.select = null
            this.$vs.notify({
              title: '消息發布成功',
              color: 'success',
              icon: 'done'
            })
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
    submitItem (box) {
      const form = {
        title: box.title.model,
        text: box.text.model,
        tag: box.tag.model
      }
      console.log(form)
      this.axios.patch(process.env.VUE_APP_APIURL + '/article/' + box.id, form)
        .then(response => {
          if (response.data.success) {
            const d = response.data.result
            box.title.detail = d.title
            box.text.detail = d.text
            box.tag.detail = d.detail
            box.edit = false
            this.$vs.notify({
              title: '商品更改已保存',
              color: 'success',
              icon: 'done'
            })
          }
        })
        .catch(error => {
          this.$vs.notify({
            title: error.response.data.message,
            color: 'danger',
            icon: 'close'
          })
        })
    },
    deleteitem (index) {
      this.axios.delete(process.env.VUE_APP_APIURL + '/article/' + this.boxs[index].id)
        .then(response => {
          if (response.data.success) {
            this.boxs.splice(index, 1)
            this.$vs.notify({
              title: '貼文已刪除',
              color: 'success',
              icon: 'done'
            })
          }
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
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/article')
      .then(response => {
        this.boxs = response.data.result.map(d => {
          return {
            edit: false,
            id: d._id,
            src: process.env.VUE_APP_APIURL + '/article/' + d.name,
            time: d.time,
            title: { detail: d.title, model: d.title },
            text: { detail: d.text, model: d.text },
            tag: { detail: d.tag, model: d.tag }
          }
        })
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

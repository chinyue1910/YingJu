<template lang="pug">
  #display.bg-white
    b-container.pt-3
      b-row
        b-form.w-100(@submit="submit").d-flex.flex-wrap.justify-content-center
          b-col(cols="12").d-lg-flex
            b-col(v-for="(box,index) in formdata" :key="index")
              b-form-group(
                :label="box.label"
                :label-for="box.id"
                :state="box.state"
              )
                b-form-input(
                  :id="box.id"
                  v-model="box.text"
                  required
                )
          b-col(cols="12").py-3.d-flex.flex-wrap
            b-col(cols="12" sm="6").py-3
              img-inputer.h-100.w-100(
                v-model='file'
                no-mask=true
                theme='light'
                accept="image/*"
                :max-size="1024"
                placeholder="請選擇或拖曳圖片至此"
                icon="img"
                :style="{maxWidth:'100%',minHeight:'150px'}")
            b-col(cols="12" sm="6")
              b-form-group(
                label="商品詳情"
                label-for="description"
              )
                b-form-textarea(
                  id="description"
                  v-model="description"
                  rows="6"
                  max-rows="6"
                )
          b-col(cols="12")
            b-button(type="submit" variant="success" :style="{flexBasis:'70px'}").w-100 新增
    b-container
      b-row.flex-column
        b-col(
          v-for="(box,index) in boxs"
          :key="index"
          :style="{maxWidth:'100%'}"
          ).p-3.mb-3
          .d-flex(:style="{border:'10px solid rgba(0,0,0,0.5)'}").flex-wrap
            b-col.carditem(cols="12" md="5").px-0
              b-img(:src="box.src")
            b-col.carditem(cols="12" md="7").d-flex.flex-column.justify-content-around
              vs-popup.holamundo(@close="bringback(box)" title="商品資訊" :active.sync='box.edit' button-close-hidden=true)
                b-form(@submit.prevent="submitItem(box)").w-100.text-center
                  b-form-group(
                    v-for="(input,inputindex) in box.inputs"
                    :key="inputindex"
                    :label="input.label"
                    :label-for="input.id + index"
                    label-cols="2"
                  )
                    b-form-input(
                      :id="input.id+index"
                      v-model="input.text"
                      required
                      :type="input.type"
                    )
                  b-form-group(
                    :label="box.description.label"
                    :label-for="box.description.id + index"
                    label-cols="2"
                  )
                    b-form-textarea(
                      :id="box.description.id+index"
                      v-model="box.description.text"
                      required
                    )
                  b-row.m-0.justify-content-center
                    b-button(variant="success" type="submit").mr-1 送出
                    b-button(variant="danger" @click="cancel(box)").ml-1 取消
              b-row(v-for="(item,indexitem) in boxs[index].inputs" :key="indexitem").py-3.mx-3
                b-col.text-success(:style="{flex:'0 0 80px'}") {{ item.label }}
                b-col {{ item.detail }}
              b-row.py-3.mx-3
                b-col.text-success(:style="{flex:'0 0 80px'}") {{ box.description.label }}
                b-col.text-break {{ box.description.detail.substr(0,100) }}
              b-row.justify-content-center
                b-button(variant="primary" @click="edit(box)") 更改資料
                b-button.ml-3(variant="danger" @click="deleteitem(index)") 刪除商品
</template>

<script>
export default {
  data () {
    return {
      file: null,
      description: '',
      formdata: [
        { label: '品名', id: 'item', state: null, text: '' },
        { label: '價格', id: 'price', state: null, text: '' },
        { label: '存貨', id: 'storage', state: null, text: '' }
      ],
      boxs: []
    }
  },
  methods: {
    submit (e) {
      e.preventDefault()
      if (this.file === null || this.file.size >= 1024 * 1024 || !this.file.type.includes('image')) {
        this.$vs.notify({
          title: '檔案格式不符',
          color: 'danger',
          icon: 'close'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.file)
        fd.append('item', this.formdata[0].text)
        fd.append('price', this.formdata[1].text)
        fd.append('storage', this.formdata[2].text)
        fd.append('description', this.description)
        this.axios.post(process.env.VUE_APP_APIURL + '/product', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            const data = response.data.result
            this.boxs.push(
              {
                edit: false,
                id: data._id,
                src: process.env.VUE_APP_APIURL + '/product/' + data.name,
                inputs: [
                  {
                    label: '品名', type: 'text', id: 'item', detail: data.item, text: data.item
                  },
                  {
                    label: '價格', type: 'number', id: 'price', detail: data.price, text: data.price
                  },
                  {
                    label: '存貨', type: 'number', id: 'storage', detail: data.storage, text: data.storage
                  }
                ],
                description: {
                  label: '描述', id: 'description', detail: data.description, text: data.description
                }
              }
            )
            this.$vs.notify({
              title: '商品新增成功',
              color: 'success',
              icon: 'done'
            })
            for (const i of this.formdata) {
              i.text = ''
            }
            this.description = ''
            this.file = null
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
        item: box.inputs[0].text,
        price: box.inputs[1].text,
        storage: box.inputs[2].text,
        description: box.description.text
      }
      this.axios.patch(process.env.VUE_APP_APIURL + '/product/' + box.id, form)
        .then(response => {
          if (response.data.success) {
            const d = response.data.result
            box.inputs[0].detail = d.item
            box.inputs[1].detail = d.price
            box.inputs[2].detail = d.storage
            box.description.detail = d.description
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
      this.axios.delete(process.env.VUE_APP_APIURL + '/product/' + this.boxs[index].id)
        .then(response => {
          if (response.data.success) {
            this.boxs.splice(index, 1)
            this.$vs.notify({
              title: '商品已下架',
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
    edit (box) {
      box.edit = true
    },
    cancel (box) {
      box.edit = false
      for (const i of box.inputs) {
        i.text = i.detail
      }
    },
    bringback (box) {
      for (const i of box.inputs) {
        i.text = i.detail
      }
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/product')
      .then(response => {
        this.boxs = response.data.result.map(d => {
          return {
            edit: false,
            id: d._id,
            src: process.env.VUE_APP_APIURL + '/product/' + d.name,
            inputs: [
              { label: '品名', type: 'text', id: 'item', detail: d.item, text: d.item },
              { label: '價格', type: 'number', id: 'price', detail: d.price, text: d.price },
              { label: '存貨', type: 'number', id: 'storage', detail: d.storage, text: d.storage }
            ],
            description: { label: '描述', id: 'description', detail: d.description, text: d.description }
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

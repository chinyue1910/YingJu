import mongoose from 'mongoose'
import dotenv from 'dotenv'
import beautifyUnique from 'mongoose-beautiful-unique-validation'
import validator from 'validator'

dotenv.config()

mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema
mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.plugin(beautifyUnique)

const userSchema = new Schema({
  account: {
    type: String,
    unique: '信箱已被使用',
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    },
    required: [true, '請輸入帳號']
  },
  password: {
    type: String,
    minlength: [6, '密碼最少 6 個字元'],
    required: [true, '請輸入密碼']
  },
  tel: {
    type: String,
    validate: {
      validator (value) {
        return validator.isMobilePhone(value, ['zh-TW'])
      },
      message: '手機格式錯誤'
    },
    unique: '手機號碼已被使用'
  },
  name: {
    type: String,
    required: [true, '請輸入姓名']
  },
  address: {
    type: String
  },
  cart: {
    type: Array
  },
  src: {
    type: String
  }
}, { versionKey: false })

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, '需要檔案名稱']
  },
  item: {
    type: String,
    required: [true, '需要輸入商品名稱'],
    unique: '商品名稱重複'
  },
  price: {
    type: Number,
    required: [true, '需要輸入商品價格']
  },
  storage: {
    type: Number,
    required: [true, '需要輸入商品存貨']
  },
  description: {
    type: String
  }
}, { versionKey: false })

const orderSchema = new Schema({
  name: {
    type: String,
    required: [true, '請輸入姓名']
  },
  tel: {
    type: String,
    validate: {
      validator (value) {
        return validator.isMobilePhone(value, ['zh-TW'])
      },
      message: '手機格式錯誤'
    },
    required: [true, '需要電話號碼']
  },
  total: {
    type: Number,
    required: [true, '需要總共價格']
  },
  order: {
    type: Object,
    required: [true, '需要訂單資料']
  },
  checkbox: {
    type: String,
    required: [true, '需要訂單狀態']
  },
  userId: {
    type: String,
    required: [true, '需要使用者ID']
  }
}, { versionKey: false })

const newsSchema = new Schema({
  name: {
    type: String,
    required: [true, '需要檔案名稱']
  },
  title: {
    type: String,
    required: [true, '需要標題']
  },
  text: {
    type: String,
    required: [true, '需要內容']
  },
  time: {
    type: String,
    validate: {
      validator (value) {
        return validator.isDate(value)
      }
    },
    required: [true, '需要目前日期']
  },
  tag: {
    type: String,
    required: [true, '需要類別']
  }
}, { versionKey: false })

const messageSchema = new Schema({
  name: {
    type: String,
    required: [true, '請輸入姓名']
  },
  email: {
    type: String,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    },
    required: [true, '請輸入信箱']
  },
  tel: {
    type: String,
    validate: {
      validator (value) {
        return value.length === 0 ? true : validator.isMobilePhone(value, ['zh-TW'])
      },
      message: '手機格式錯誤'
    }
  },
  text: {
    type: String,
    maxlength: [100, '最多 100 字'],
    required: [true, '請輸入向我們傳達的事項']
  },
  checked: {
    type: Boolean,
    required: [true, '確認是否已讀']
  },
  time: {
    type: Number,
    required: [true, '需要訊息傳送時間']
  }
}, { versionKey: false })

const users = mongoose.model(process.env.COLLECTION_USER, userSchema)
const products = mongoose.model(process.env.COLLECTION_PRODUCT, productSchema)
const orders = mongoose.model(process.env.COLLECTION_ORDER, orderSchema)
const news = mongoose.model(process.env.COLLECTION_NEWS, newsSchema)
const messages = mongoose.model(process.env.COLLECTION_MESSAGE, messageSchema)
const connection = mongoose.connection

export default {
  users, connection, products, orders, news, messages
}

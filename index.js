import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import connectMongo from 'connect-mongo'
import session from 'express-session'
import multer from 'multer'
import md5 from 'md5'
import dotenv from 'dotenv'
import db from './db.js'
import path from 'path'
import FTPStorage from 'multer-ftp'
import fs from 'fs'
import axios from 'axios'
import Client from 'ftp'
import nodemailer from 'nodemailer'

dotenv.config()

const MongoStore = connectMongo(session)

const app = express()
app.use(bodyParser.json())
app.use(cors({
  origin (origin, callback) {
    if (origin === undefined) {
      callback(null, true)
    } else {
      if (process.env.ALLOW_CORS === 'true') {
        callback(null, true)
      } else if (origin.includes('github')) {
        callback(null, true)
      } else {
        callback(new Error('Not allow'), false)
      }
    }
  },
  credentials: true
}))

app.use(session({
  secret: 'secrect',
  store: new MongoStore({
    mongooseConnection: db.connection,
    collection: process.env.COLLECTION_SESSION
  }),
  cookie: {
    maxAge: 1000 * 60 * 30,
    sameSite: 'none',
    secure: true
  },
  proxy: true,
  saveUninitialized: false,
  rolling: true,
  resave: false
}))

app.set('trust proxy', true)

let storage
if (process.env.FTP === 'false') {
  storage = multer.diskStorage({
    destination (req, file, cb) {
      cb(null, 'images/')
    },
    filename (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
} else {
  storage = new FTPStorage({
    basepath: '/',
    ftp: {
      host: process.env.FTP_HOST,
      secure: false,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD
    },
    destination (req, file, options, cb) {
      cb(null, options.basepath + Date.now() + path.extname(file.originalname))
    }
  })
}

const upload = multer({
  storage,
  fileFilter (req, file, cb) {
    if (!file.mimetype.includes('image')) {
      cb(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      cb(null, true)
    }
  },
  limits: {
    fileSize: 1024 * 1024
  }
})

app.get('/heartbeat', async (req, res) => {
  res.send(req.session.user !== undefined)
  // return boolean
})

// 註冊帳號
app.post('/users', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  try {
    const response = await axios.get('https://www.google.com/recaptcha/api/siteverify?secret=6Lcp4LgZAAAAAAubwgtu4ub5wJFe5OAt7Du2sV7Z&response=' + req.body.captcha)
    if (!response.data.success) {
      throw new Error('媽的你亂來')
    }
    await db.users.create({
      account: req.body.account,
      password: md5(req.body.password),
      tel: req.body.tel,
      name: req.body.name,
      address: ''
    })
    res.send({ success: true, message: '' })
  } catch (error) {
    if (
      error.message === '媽的你亂來'
    ) {
      res.status(401).send({ success: false, message: '你是機器人' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
      console.log(error.msg)
    }
  }
})

// 登入
app.post('/login', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  try {
    const result = await db.users.find({ account: req.body.account, password: md5(req.body.password) })
    if (result.length > 0) {
      req.session.user = result[0].name
      res.send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '帳號密碼錯誤' })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 登出
app.delete('/logout', async (req, res) => {
  // https://www.npmjs.com/package/express-session#sessiondestroycallback
  req.session.destroy(error => {
    if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      res.clearCookie().send({ success: true, message: '' })
    }
  })
})

// 修改個人圖片
app.post('/profile/image/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  upload.single('image')(req, res, async err => {
    if (err instanceof multer.MulterError) {
      // 上傳錯誤
      let message = ''
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else {
        message = '格式不符'
      }
      res.status(400).send({ success: false, message })
    } else if (err) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        let src = ''
        if (process.env.FTP === 'true') {
          src = path.basename(req.file.path)
        } else {
          src = req.file.filename
        }
        const result = await db.users.findByIdAndUpdate(req.params.id, { src: src })
        const c = new Client()
        c.on('ready', function () {
          c.delete(result.src, err => {
            if (err) console.log(err)
            c.end()
          })
        })
        c.connect({ host: process.env.FTP_HOST, user: process.env.FTP_USER, password: process.env.FTP_PASSWORD })
        const resultnew = await db.users.findByIdAndUpdate(req.params.id, { src: src }, { new: true })
        res.send({ success: true, message: '', resultnew })
      } catch (error) {
        if (error.name === 'CastError') {
          res.status(400).send({ success: false, message: 'ID 格式錯誤' })
        } else if (error.name === 'ValidationError') {
          const key = Object.keys(error.errors)[0]
          const message = error.errors[key].message
          res.status(400).send({ success: false, message })
        } else {
          res.status(500).send({ success: false, message: '伺服器錯誤' })
          console.log(error)
        }
      }
    }
  })
})

// 取得個人圖片
app.get('/profile/image/:name', async (req, res) => {
  if (process.env.FTP === 'false') {
    const path = process.cwd() + '/images/' + req.params.name
    // https://nodejs.org/api/fs.html#fs_fs_existssync_path
    const exists = fs.existsSync(path)
    if (exists) {
      // https://expressjs.com/zh-tw/4x/api.html#res.sendFile
      res.sendFile(path)
    } else {
      res.status(404).send({ success: false, message: '找不到圖片' })
    }
  } else {
    // https://expressjs.com/zh-tw/4x/api.html#res.redirect
    // 將要求重新導向
    res.redirect('http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.name)
  }
})

// 取得個人資料
app.get('/profile/:id', async (req, res) => {
  try {
    const result = await db.users.find({ _id: req.params.id })
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 取得所有使用者資料
app.get('/membership', async (req, res) => {
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.users.find()
    const resultNew = result.filter(user =>
      user.name !== process.env.MANAGER_NAME
    )
    res.send({ success: true, message: '', resultNew })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 刪除使用者帳號
app.delete('/membership/:id', async (req, res) => {
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    await db.users.findByIdAndRemove(req.params.id)
    res.send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
      console.log(error)
    }
  }
})

// 更改個人資料
app.patch('/profile/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.users.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send({ success: true, message: '', result })
  } catch (error) {
    // ID 格式不是 MongoDB 的格式
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 更改密碼
app.patch('/privacy/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.users.findById(req.params.id)
    console.log(result)
    if (result.password !== md5(req.body.old)) {
      res.status(404).send({ success: false, message: '原始密碼錯誤' })
      return
    }
    // 檢查相片擁有者是不是本人
    result = await db.users.findByIdAndUpdate(req.params.id, { password: md5(req.body.password) }, { new: true })
    res.send({ success: true, message: '', result })
  } catch (error) {
    // ID 格式不是 MongoDB 的格式
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 上傳商品
app.post('/product', async (req, res) => {
  if (!req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (req.session.user !== process.env.MANAGER_NAME) {
    console.log(req.session.user)
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  upload.single('image')(req, res, async err => {
    if (err instanceof multer.MulterError) {
      // 上傳錯誤
      let message = ''
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else {
        message = '格式不符'
      }
      res.status(400).send({ success: false, message })
    } else if (err) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        let name = ''
        if (process.env.FTP === 'true') {
          name = path.basename(req.file.path)
        } else {
          name = req.file.filename
        }
        const result = await db.products.create(
          {
            item: req.body.item,
            price: req.body.price,
            storage: req.body.storage,
            description: req.body.description,
            name
          }
        )
        res.send({ success: true, message: '', result })
      } catch (error) {
        if (error.name === 'ValidationError') {
          const key = Object.keys(error.errors)[0]
          const message = error.errors[key].message
          res.status(400).send({ success: false, message })
        } else {
          res.status(500).send({ success: false, message: '伺服器錯誤' })
          console.log(error.msg)
        }
      }
    }
  })
})

// 取得商品圖片
app.get('/product/:name', async (req, res) => {
  if (process.env.FTP === 'false') {
    const path = process.cwd() + '/images/' + req.params.name
    // https://nodejs.org/api/fs.html#fs_fs_existssync_path
    const exists = fs.existsSync(path)
    if (exists) {
      // https://expressjs.com/zh-tw/4x/api.html#res.sendFile
      res.sendFile(path)
    } else {
      res.status(404).send({ success: false, message: '找不到圖片' })
    }
  } else {
    // https://expressjs.com/zh-tw/4x/api.html#res.redirect
    // 將要求重新導向
    res.redirect('http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.name)
  }
})

// 取得所有商品
app.get('/product', async (req, res) => {
  try {
    const result = await db.products.find()
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 更改商品明細
app.patch('/product/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.products.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send({ success: true, message: '', result })
  } catch (error) {
    // ID 格式不是 MongoDB 的格式
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 下架商品
app.delete('/product/:id', async (req, res) => {
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.products.findByIdAndRemove(req.params.id)
    const c = new Client()
    c.on('ready', function () {
      c.delete(result.name, err => {
        if (err) console.log(err)
        c.end()
      })
    })
    c.connect({ host: process.env.FTP_HOST, user: process.env.FTP_USER, password: process.env.FTP_PASSWORD })
    res.send({ success: true, message: '' })
  } catch (error) {
    // ID 格式不是 MongoDB 的格式
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 新增至購物車
app.post('/cart/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.users.findById(req.params.id)
    const index = result.cart.map(d => {
      return d.product
    }).indexOf(req.body.product)
    if (index === -1) {
      result.cart.push(req.body)
    } else {
      result.cart[index].count++
      result.cart.set(index, result.cart[index])
    }
    await result.save()
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 刪除購物車品項
app.patch('/cart/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.users.findById(req.params.id)
    result.cart.remove(result.cart[req.body.index])
    await result.save()
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 新增訂單
app.post('/order/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const userdetail = await db.users.findById(req.params.id)
    const productdetail = await db.products.find()
    class MyError extends Error {
      constructor (status, product) {
        super(status, product)
        this.status = status
        this.product = product
      }
    }
    const errorproduct = []
    let haserror = false
    for (const i of req.body.slice(0, req.body.length - 2)) {
      const product = productdetail.filter(d => {
        return d.item === i.product
      })
      if (i.count > product[0].storage) {
        haserror = true
      }
      errorproduct.push(product[0])
    }
    if (haserror) { throw new MyError('商品庫存不足', errorproduct) }
    const result = await db.orders.create({
      name: userdetail.name,
      tel: userdetail.tel,
      total: req.body[req.body.length - 2].totalprice,
      order: req.body.slice(0, req.body.length - 2),
      checkbox: 'waiting',
      userId: req.body[req.body.length - 1].userId
    })
    userdetail.cart = []
    await userdetail.save()
    for (const i of req.body.slice(0, req.body.length - 2)) {
      const productStage = await db.products.findById(i.id)
      productStage.storage -= i.count
      await productStage.save()
    }
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.message === '商品庫存不足') {
      res.status(401).send({ success: false, message: error })
    } else if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 取得訂單
app.get('/order', async (req, res) => {
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.orders.find()
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 修改訂單狀態
app.patch('/order', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.orders.find()
    for (const i in req.body) {
      result[i].overwrite(req.body[i])
      await result[i].save()
    }
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 取得個人訂單
app.get('/track/:id', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.orders.find({ userId: req.params.id })
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 取消訂單
app.delete('/track/:id', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.orders.findByIdAndDelete(req.params.id)
    console.log(result)
    res.send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 新增最新消息
app.post('/article', async (req, res) => {
  if (!req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  upload.single('image')(req, res, async err => {
    if (err instanceof multer.MulterError) {
      // 上傳錯誤
      let message = ''
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else {
        message = '格式不符'
      }
      res.status(400).send({ success: false, message })
    } else if (err) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        let name = ''
        if (process.env.FTP === 'true') {
          name = path.basename(req.file.path)
        } else {
          name = req.file.filename
        }
        const result = await db.news.create({
          name,
          title: req.body.title,
          text: req.body.text,
          time: req.body.time,
          tag: req.body.tag
        })
        res.send({ success: true, message: '', result })
      } catch (error) {
        if (error.name === 'ValidationError') {
          const key = Object.keys(error.errors)[0]
          const message = error.errors[key].message
          res.status(400).send({ success: false, message })
        } else {
          res.status(500).send({ success: false, message: '伺服器錯誤' })
        }
      }
    }
  })
})

// 取得最新消息
app.get('/article', async (req, res) => {
  try {
    const result = await db.news.find()
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 取得消息圖片
app.get('/article/:name', async (req, res) => {
  if (process.env.FTP === 'false') {
    const path = process.cwd() + '/images/' + req.params.name
    // https://nodejs.org/api/fs.html#fs_fs_existssync_path
    const exists = fs.existsSync(path)
    if (exists) {
      // https://expressjs.com/zh-tw/4x/api.html#res.sendFile
      res.sendFile(path)
    } else {
      res.status(404).send({ success: false, message: '找不到圖片' })
    }
  } else {
    // https://expressjs.com/zh-tw/4x/api.html#res.redirect
    // 將要求重新導向
    res.redirect('http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.name)
  }
})

// 更新最新消息
app.patch('/article/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.news.findByIdAndUpdate(req.params.id, req.body, { new: true })
    console.log(result)
    res.send({ success: true, message: '', result })
  } catch (error) {
    // ID 格式不是 MongoDB 的格式
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 刪除最新消息
app.delete('/article/:id', async (req, res) => {
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.news.findByIdAndRemove(req.params.id)
    const c = new Client()
    c.on('ready', function () {
      c.delete(result.name, err => {
        if (err) console.log(err)
        c.end()
      })
    })
    c.connect({ host: process.env.FTP_HOST, user: process.env.FTP_USER, password: process.env.FTP_PASSWORD })
    res.send({ success: true, message: '' })
  } catch (error) {
    // ID 格式不是 MongoDB 的格式
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 新增改善訊息
app.post('/message', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  try {
    const result = await db.messages.create(req.body)
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 取得所有改善訊息
app.get('/message', async (req, res) => {
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.messages.find()
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 確認改善訊息是否已讀
app.patch('/message', async (req, res) => {
  if (req.session.user !== process.env.MANAGER_NAME) {
    res.status(401).send({ success: false, message: '無權限' })
    return
  }
  try {
    const result = await db.messages.updateMany({ checked: true })
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 忘記密碼
app.post('/send', async (req, res) => {
  try {
    const result = await db.users.find({ account: req.body.email })
    if (result.length === 0) {
      throw new Error('Not Exist')
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    const validation = Math.floor(Math.random() * 100000000).toString()

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"映筑香菇農場"<zxc874631@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: '重設密碼', // Subject line
      html: `<b>你的新密碼為 ${validation} </b><p>請盡速至會員專區修改密碼以保護你的隱私</p>` // html body
    })

    await db.users.updateOne({ account: req.body.email }, { password: md5(validation) })

    console.log('Message sent: %s', info.messageId)
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    res.send({ success: true, message: '' })
  } catch (error) {
    if (error.message === 'Not Exist') {
      res.status(401).send({ success: false, message: '此帳號不存在' })
    }
  }
})

// FB 登入
app.post('/fblogin', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  try {
    let result = await db.users.find({ account: req.body.account, password: md5(req.body.password) })
    if (result.length > 0) {
      req.session.user = result[0].name
      result = result[0]
      res.send({ success: true, message: '', result })
    } else {
      result = await db.users.create({
        account: req.body.account,
        password: md5(req.body.password),
        tel: '09' + req.body.password.substr(0, 8),
        name: req.body.name,
        address: '',
        src: req.body.profileImg
      })
      req.session.user = result.name
      res.send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
      console.log(error)
    }
  }
})

app.listen(process.env.PORT, () => {
  console.log('已啟動')
})

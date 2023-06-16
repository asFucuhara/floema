const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const prismic = require('@prismicio/client')
const prismicH = require('@prismicio/helpers')
const path = require('path')
const express = require('express')

const errorhandler = require('errorhandler')
const logger = require('morgan')
const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()
const port = 3000

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
  app.use(logger('dev'))
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

const client = prismic.createClient('asfucu-floema', {
  fetch,
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  routes: []
})

const fetchDefaults = async () => {
  const preloader = await client.getSingle('preloader')
  const meta = await client.getSingle('metadata')

  return { preloader, meta }
}

const handleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'about') {
    return '/about'
  }
}

app.use((req, res, next) => {
  // res.locals.ctx = {
  //   prismic
  // }

  res.locals.prismicH = prismicH
  res.locals.Link = handleLinkResolver

  res.locals.indexedNumbers = index => index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : 'Four'

  next()
})

app.get('/', async (req, res) => {
  const { meta, preloader } = await fetchDefaults()
  const home = await client.getSingle('home')
  const collections = await client.getAllByType('collection', { fetchLinks: 'product.image' })

  res.render('pages/home', { home, preloader, collections, meta })
})

app.get('/about', async (req, res) => {
  const { meta, preloader } = await fetchDefaults()

  const about = await client.getSingle('about')

  res.render('pages/about', { about, meta, preloader })
})

app.get('/collections', async (req, res) => {
  const { meta, preloader } = await fetchDefaults()

  const collections = await client.getAllByType('collection', { fetchLinks: 'product.image' })
  const home = await client.getSingle('home')

  res.render('pages/collections', { meta, collections, home, preloader })
})

app.get('/detail/:uid', async (req, res) => {
  const { meta, preloader } = await fetchDefaults()

  const { uid } = req.params
  const product = await client.getByUID('product', uid, { fetchLinks: 'collection.title' })

  res.render('pages/detail', { product, meta, preloader })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

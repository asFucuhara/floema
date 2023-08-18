const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const prismic = require('@prismicio/client')
const prismicH = require('@prismicio/helpers')
const path = require('path')
const express = require('express')

const errorhandler = require('errorhandler')
const logger = require('morgan')
const bodyParser = require('body-parser')
const UAParser = require('ua-parser-js')

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
  const home = await client.getSingle('home')
  const preloader = await client.getSingle('preloader')
  const meta = await client.getSingle('metadata')
  const about = await client.getSingle('about')

  const collections = await client.getAllByType('collection', { fetchLinks: 'product.image' })

  const assets = []

  home.data.gallery.forEach(item => assets.push(item.image.url))

  about.data.gallery.forEach(item => assets.push(item.images.url))

  about.data.body.forEach(section => {
    if (section.slice_type === 'galery') {
      section.items.forEach(item => assets.push(item.image.url))
    }
  })

  collections.forEach(collection => {
    collection.data.products.forEach(item => {
      assets.push(item.products_product.data.image.url)
    })
  })

  return { preloader, meta, home, collections, about, assets }
}

const handleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'about') {
    return '/about'
  }

  if (doc.type === 'home') {
    return '/collections'
  }
}

app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isTablet = ua.device.type === 'tablet'
  res.locals.isPhone = ua.device.type === 'mobile'

  res.locals.prismicH = prismicH
  res.locals.Link = handleLinkResolver

  res.locals.indexedNumbers = index => index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : 'Four'

  next()
})

app.get('/', async (req, res) => {
  const { meta, preloader, home, collections, assets } = await fetchDefaults()

  res.render('pages/home', { home, preloader, collections, meta, assets })
})

app.get('/about', async (req, res) => {
  const { meta, preloader, about, assets } = await fetchDefaults()

  res.render('pages/about', { about, meta, preloader, assets })
})

app.get('/collections', async (req, res) => {
  const { home, meta, preloader, collections, assets } = await fetchDefaults()

  res.render('pages/collections', { meta, collections, home, preloader, assets })
})

app.get('/detail/:uid', async (req, res) => {
  const { home, meta, preloader, assets } = await fetchDefaults()

  const { uid } = req.params
  const product = await client.getByUID('product', uid, { fetchLinks: 'collection.title' })

  res.render('pages/detail', { product, meta, preloader, home, assets })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

import { each } from 'lodash'
import NormalizeWheel from 'normalize-wheel'

import About from './pages/About'
import Collections from './pages/Collections'
import Detail from './pages/Detail'
import Home from './pages/Home'
import Preloader from './components/Preloader'
import Navigation from './components/Navigation'
import Canvas from './components/Canvas'

class App {
  constructor () {
    this.createContent()
    this.createCanvas()
    this.createPreloader()
    this.createPages()
    this.createNavigation()

    this.addEventListeners()
    this.addLinkListeners()

    this.onResize()

    this.update()
  }

  createPages () {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home()
    }

    this.page = this.pages[this.template]
    this.page.create()

    this.onResize()
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createCanvas () {
    this.canvas = new Canvas({ template: this.template })
  }

  createNavigation () {
    this.navigation = new Navigation({ template: this.template })
  }

  createPreloader () {
    this.preloader = new Preloader({ canvas: this.canvas })
    this.preloader.once('completed', _ => this.onPreloaded())
  }

  onPreloaded () {
    this.canvas.onPreloaded()
    this.onResize()

    this.page.show()
  }

  onPopState () {
    this.onChange({ url: window.location.pathname, push: false })
  }

  async onChange ({ url, push = true }) {
    this.canvas.onChangeStart(this.template, url)
    await this.page.hide()
    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      if (push) {
        window.history.pushState({}, '', url)
      }

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.navigation.onChange(this.template)

      this.content.innerHTML = divContent.innerHTML
      this.content.setAttribute('data-template', this.template)

      this.canvas.onChangeEnd(this.template)

      this.page = this.pages[this.template]
      this.page.create()

      this.onResize()

      this.page.show()
      this.addLinkListeners()
    } else {
      console.log('error')
    }
  }

  onResize () {
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize()
    }

    window.requestAnimationFrame(() => {
      if (this.page && this.page.onResize) {
        this.page.onResize()
      }
    })
  }

  onTouchDown (event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event)
    }
  }

  onTouchMove (event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event)
    }
  }

  onTouchUp (event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event)
    }
  }

  onWheel (event) {
    const normalizedWheel = NormalizeWheel(event)

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel)
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel)
    }
  }

  update () {
    if (this.page && this.page.update) {
      this.page.update()
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll) // suggestion <- not a big fan of this passing a object property to another object by the parent
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  addEventListeners () {
    window.addEventListener('mousewheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
    window.addEventListener('popstate', this.onPopState.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()

        const { href } = link

        this.onChange({ url: href })
      }
    })
  }
}

new App()

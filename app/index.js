import { each } from 'lodash'
import About from './pages/About'
import Collections from './pages/Collections'
import Detail from './pages/Detail'
import Home from './pages/Home'
import Preloader from './components/Preloader'

class App {
  constructor () {
    this.createPreloader()
    this.createContent()
    this.createPages()

    this.addLinkListeners()
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
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', _ => this.onPreloaded())
  }

  onPreloaded () {
    this.preloader.destroy()

    this.page.show()
  }

  async onChange (url) {
    await this.page.hide()
    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.content.innerHTML = divContent.innerHTML
      this.content.setAttribute('data-template', this.template)

      this.page = this.pages[this.template]
      this.page.create()
      this.addLinkListeners()
      await this.page.show()
    } else {
      console.log('error')
    }
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()

        const { href } = link

        this.onChange(href)
      }
    })
  }
}

new App()

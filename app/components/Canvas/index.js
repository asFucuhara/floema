import { Camera, Renderer, Transform } from 'ogl'

import Home from './Home'
import About from './About'
import Collections from './Collections'

export default class Canvas {
  constructor ({ template }) {
    this.template = template

    this.x = { start: 0, distance: 0, end: 0 }
    this.y = { start: 0, distance: 0, end: 0 }

    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()
  }

  createRenderer () {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true
    })

    this.gl = this.renderer.gl

    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5
  }

  createScene () {
    this.scene = new Transform()
  }

  createAbout () {
    this.about = new About({
      gl: this.gl,
      scene: this.scene
    })
  }

  destroyAbout () {
    if (this.about) {
      this.about.destroy()
      this.about = null
    }
  }

  createCollections () {
    this.collections = new Collections({
      gl: this.gl,
      scene: this.scene
    })
  }

  destroyCollections () {
    if (this.collections) {
      this.collections.destroy()
      this.collections = null
    }
  }

  createHome () {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene
    })
  }

  destroyHome () {
    if (this.home) {
      this.home.destroy()
      this.home = null
    }
  }

  onPreloaded () {
    this.onChangeEnd(this.template)
  }

  onChangeStart () {
    if (this.about) {
      this.about.hide()
    }

    if (this.collections) {
      this.collections.hide()
    }

    if (this.home) {
      this.home.hide()
    }
  }

  onChangeEnd (template) {
    if (template === 'home') {
      this.createHome()
    } else {
      this.destroyHome()
    }

    if (template === 'collections') {
      this.gl.canvas.style.zIndex = 10000
      this.createCollections()
    } else {
      this.gl.canvas.style.zIndex = ''

      this.destroyCollections()
    }

    if (template === 'about') {
      this.createAbout()
    } else {
      this.destroyAbout()
    }
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.sizes = {
      height,
      width
    }

    if (this.home) {
      this.home.onResize({
        sizes: this.sizes
      })
    }

    if (this.collections) {
      this.collections.onResize({
        sizes: this.sizes
      })
    }

    if (this.about) {
      this.about.onResize({
        sizes: this.sizes
      })
    }
  }

  onTouchDown (event) {
    this.isDown = true

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY

    if (this.home) {
      this.home.onTouchDown({ x: this.x, y: this.y })
    }


    if (this.collections) {
      this.collections.onTouchDown({ x: this.x, y: this.y })
    }

    if (this.about) {
      this.about.onTouchDown({ x: this.x, y: this.y })
    }
  }

  onTouchMove (event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    if (this.home) {
      this.home.onTouchMove({ x: this.x, y: this.y })
    }


    if (this.collections) {
      this.collections.onTouchMove({ x: this.x, y: this.y })
    }

    if (this.about) {
      this.about.onTouchMove({ x: this.x, y: this.y })
    }
  }

  onTouchUp (event) {
    this.isDown = false

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    if (this.home) {
      this.home.onTouchUp({ x: this.x, y: this.y })
    }


    if (this.collections) {
      this.collections.onTouchUp({ x: this.x, y: this.y })
    }

    if (this.about) {
      this.about.onTouchUp({ x: this.x, y: this.y })
    }
  }

  onWheel (event) {
    if (this.home) {
      this.home.onWheel(event)
    }

    if (this.collections) {
      this.collections.onWheel(event)
    }

    if (this.about) {
      this.about.onWheel(event)
    }
  }

  update (scroll) {
    if (this.home) {
      this.home.update(scroll)
    }

    if (this.collections) {
      this.collections.update(scroll)
    }

    if (this.about) {
      this.about.update(scroll)
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
  }
}

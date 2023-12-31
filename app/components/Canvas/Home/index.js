import { map } from 'lodash'
import { Transform, Plane } from 'ogl'
import Media from './Media'
import { gsap } from 'gsap'

export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl
    this.group = new Transform()
    this.sizes = sizes

    this.galleryElement = document.querySelector('.home__gallery')
    this.mediasElements = document.querySelectorAll('.home__gallery__media__image')

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.3
    }

    this.scrollCurrent = {
      x: 0,
      y: 0
    }

    this.scroll = {
      x: 0,
      y: 0
    }

    this.createGeometry()
    this.createGallery()

    this.group.setParent(scene)

    this.show()
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    })
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes
      })
    })
  }

  show() {
    map(this.medias, media => media.show())
  }

  hide() {
    map(this.medias, media => media.hide())
  }

  onResize(event) {
    if (!this.galleryElement) return
    // this.scroll = { x: 0, y: 0 }
    // this.x.target = 0
    // this.y.target = 0

    this.galleryBounds = this.galleryElement.getBoundingClientRect()

    this.sizes = event.sizes
    this.gallerySizes = {
      width: this.galleryBounds.width / window.innerWidth * this.sizes.width,
      height: this.galleryBounds.height / window.innerHeight * this.sizes.height
    }

    map(this.medias, media => media.onResize(event, this.sizes))
  }

  onTouchDown({ x, y }) {
    this.speed.target = 0.5
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end
    const yDistance = y.start - y.end

    this.x.target = this.scrollCurrent.x - xDistance
    this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp({ x, y }) {
    this.speed.target = 0
  }

  onWheel({ pixelX, pixelY }) {
    this.x.target -= pixelX
    this.y.target -= pixelY
  }

  update() {
    if (!this.galleryBounds) return

    const a = this.x.target - this.x.current
    const b = this.y.target - this.y.current

    this.speed.current = gsap.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)

    this.x.current = gsap.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
    this.y.current = gsap.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

    if (this.scroll.x < this.x.current) {
      this.x.direction = 'right'
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = 'left'
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'bottom'
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'top'
    }

    this.scroll.x = this.x.current
    this.scroll.y = this.y.current


    map(this.medias, (media, index) => {
      if (this.x.direction === 'left') {
        const x = media.mesh.position.x + media.mesh.scale.x / 2
        if (x < -this.sizes.width / 2) {
          media.extra.x += this.gallerySizes.width
          media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      } else if (this.x.direction === 'right') {
        const x = media.mesh.position.x - media.mesh.scale.x / 2
        if (x > this.sizes.width / 2) {
          media.extra.x -= this.gallerySizes.width
          media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      }

      if (this.y.direction === 'bottom') {
        const y = media.mesh.position.y + media.mesh.scale.y / 2
        if (y < -this.sizes.height / 2) {
          media.extra.y += this.gallerySizes.height
          media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      } else if (this.y.direction === 'top') {
        const y = media.mesh.position.y - media.mesh.scale.y / 2
        if (y > this.sizes.height / 2) {
          media.extra.y -= this.gallerySizes.height
          media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      }

      media.update(this.scroll, this.speed.current)
    })
  }

  destroy() {
    map(this.medias, (media, index) => {
      media.destroy()
    })
  }
}

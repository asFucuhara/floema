import { map } from 'lodash'
import { Transform, Plane } from 'ogl'
import Media from './Media'
import { gsap } from 'gsap'
import Prefix from 'prefix'

export default class Collections {
  constructor ({ gl, scene, sizes }) {
    this.gl = gl
    this.group = new Transform()
    this.sizes = sizes

    this.transformPrefix = Prefix('transform')

    this.galleryElement = document.querySelector('.collections__gallery')
    this.galleryWrapperElement = document.querySelector('.collections__gallery__wrapper')

    this.titlesElement = document.querySelector('.collections__titles')
    this.collectionsElements = document.querySelectorAll('.collections__article')
    this.collectionsElementsActive = 'collections__article--active'
    this.mediasElements = document.querySelectorAll('.collections__gallery__media')

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      lerp: 0.1,
      velocity: 1,
      limit: Infinity
    }

    this.createGeometry()
    this.createGallery()

    this.group.setParent(scene)

    this.show()
  }

  createGeometry () {
    this.geometry = new Plane(this.gl)
  }

  createGallery () {
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

  show () {
    map(this.medias, media => media.show())
  }

  hide () {
    map(this.medias, media => media.hide())
  }

  onResize (event) {
    if (!this.galleryWrapperElement) return
    // this.scroll = { x: 0, y: 0 }

    this.bounds = this.galleryWrapperElement.getBoundingClientRect()

    this.sizes = event.sizes

    // this.scroll.last = this.scroll.target = 0
    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth

    map(this.medias, media => media.onResize(event, this.sizes))
  }

  onTouchDown ({ x, y }) {
    this.scroll.last = this.scroll.current
  }

  onTouchMove ({ x, y }) {
    const distance = x.start - x.end

    this.scroll.target = this.scroll.last - distance
  }

  onTouchUp ({ x, y }) {
  }

  onWheel ({ pixelY }) {
    this.scroll.target -= pixelY
  }

  onChange (index) {
    this.index = index

    const selectedCollection = parseInt(this.mediasElements[index]
      ? this.mediasElements[index].getAttribute('data-index')
      : this.mediasElements[this.medias.length - 1].getAttribute('data-index'))

    map(this.collectionsElements, (element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add(this.collectionsElementsActive)
      } else {
        element.classList.remove(this.collectionsElementsActive)
      }
    })

    this.titlesElement.style[this.transformPrefix] = `translateY(-${25 * selectedCollection}%) translate(-50%, -50%) rotate(-90deg)`
  }

  update () {
    if (!this.bounds) return

    this.scroll.target = gsap.utils.clamp(-this.scroll.limit, 0, this.scroll.target)

    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)
    this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px`

    if (this.scroll.last < this.scroll.current) {
      this.scroll.direction = 'right'
    } else if (this.scroll.last > this.scroll.current) {
      this.scroll.direction = 'left'
    }

    this.scroll.last = this.scroll.current

    map(this.medias, (media, index) => {
      media.update(this.scroll.current)
    })
    const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length)

    if (this.index !== index) {
      this.onChange(index)
    }
  }

  destroy () {
    map(this.medias, (media, index) => {
      media.destroy()
    })
  }
}

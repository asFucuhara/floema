import { Transform } from 'ogl'

import { gsap } from 'gsap'
import { map } from 'lodash'
import Media from './Media'

export default class Gallery {
  constructor ({ element, geometry, gl, scene, index, sizes }) {
    this.element = element
    this.elementWrapper = element.querySelector('.about__gallery__wrapper')
    this.geometry = geometry
    this.gl = gl
    this.scene = scene
    this.index = index
    this.sizes = sizes

    this.group = new Transform()

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      lerp: 0.1
    }

    this.createMedias()

    this.group.setParent(this.scene)
  }

  createMedias () {
    this.mediasElements = this.elementWrapper.querySelectorAll('.about__gallery__media')

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
    // this.scroll.target = 0
    // this.scroll.current = 0

    this.bounds = this.element.getBoundingClientRect()

    this.sizes = event.sizes
    console.log(event.sizes);
    this.width = this.bounds.width / window.innerWidth * this.sizes.width

    this.scroll.current = 0

    map(this.medias, media => media.onResize(event, this.scroll.current))
  }

  onTouchDown ({ x, y }) {
    this.scroll.start = this.scroll.current
  }

  onTouchMove ({ x, y }) {
    const distance = x.start - x.end

    this.scroll.target = this.scroll.current - distance
  }

  onTouchUp ({ x, y }) {
  }

  update () {
    if (!this.bounds) return

    if (this.scroll.current < this.scroll.target) {
      this.direction = 'right'
    } else if (this.scroll.current > this.scroll.target) {
      this.direction = 'left'
    }

    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)

    map(this.medias, (media, index) => {
      if (this.direction === 'left') {
        const x = media.mesh.position.x + media.mesh.scale.x / 2
        if (x < -this.sizes.width / 2) {
          media.extra += this.width
        }
      } else if (this.direction === 'right') {
        const x = media.mesh.position.x - media.mesh.scale.x / 2
        if (x > this.sizes.width / 2) {
          media.extra -= this.width
        }
      }

      media.update(this.scroll.current)

      // media.mesh.position.y = Math.ceil(media.mesh.position.x / this.width * Math.PI) * 25 - 1
    })
  }

  destroy () {
    this.group.setParent(null)
  }
}

import { each } from 'lodash'
import Component from '../classes/Component'
import { gsap } from 'gsap'
import { Texture } from 'ogl'

import { split } from '../utils/text'

export default class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img')
      }
    })

    this.canvas = canvas

    window.TEXTURES = {}

    split({
      element: this.elements.title,
      expression: '<br />'
    })

    split({
      element: this.elements.title,
      expression: '<br />'
    })

    this.elements.titleSpans = document.querySelectorAll('span span')

    this.length = 0

    this.createLoader()
  }

  createLoader() {
    each(window.ASSETS, image => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false
      })

      const media = new window.Image()

      media.crossOrigin = 'anonymous'
      media.src = image

      window.TEXTURES[image] = texture

      media.onload = () => {
        texture.image = media

        this.onAssetLoaded()
      }

      // element.onload = _ => this.onAssetLoaded(element)
      // element.src = element.getAttribute('data-src')
    })
  }

  onAssetLoaded(image) {
    this.length += 1
    const percent = this.length / window.ASSETS.length

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded() {
    return new Promise(resolve => {


      this.animateOut = gsap.timeline({
        delay: 1
      })

      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: 'expo',
        stagger: 0.1,
        y: '100%'
      })

      this.animateOut.to(this.elements.numberText, {
        duration: 1.5,
        ease: 'expo',
        stagger: 0.1,
        y: '100%'
      }, '-=1.4')

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 1
      })

      this.animateOut.call(() => {
        this.emit('completed')
      })
    })
  }

  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}

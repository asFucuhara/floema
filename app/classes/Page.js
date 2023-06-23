import GSAP from 'gsap'
import NormalizeWheel from 'normalize-wheel'
import { map, each } from 'lodash'
import Prefix from 'prefix'

import { ColorsManager } from '../classes/Colors'

import Title from '../animations/Title'
import Label from '../animations/Label'
import Paragraph from '../animations/Paragraph'
import Highlight from '../animations/Highlight'
import AsyncLoad from './AsyncLoad'

export default class Page {
  constructor ({ id, element, elements }) {
    this.id = id
    this.selector = element
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsLabels: '[data-animation="label"]',
      animationsParagraph: '[data-animation="paragraph"]',
      animationsHighlight: '[data-animation="highlight"]',
      preloaders: '[data-src]'
    }
    this.transfomPrefix = Prefix('transform')

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList) {
        this.elements[key] = entry
      } else if (Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)
        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })

    this.createAnimations()
    this.createPreloader()
  }

  createAnimations () {
    this.animations = []
    this.animationsTitles = map(
      this.elements.animationsTitles,
      element => new Title({ element })
    )
    this.animations.push(...this.animationsTitles)

    this.animationsHighlight = map(
      this.elements.animationsHighlight,
      element => new Highlight({ element })
    )
    this.animations.push(...this.animationsHighlight)

    this.animationsLabels = map(
      this.elements.animationsLabels,
      element => new Label({ element }))
    this.animations.push(...this.animationsLabels)

    this.animationsParagraph = map(
      this.elements.animationsParagraph,
      element => new Paragraph({ element }))
    this.animations.push(...this.animationsParagraph)
  }

  createPreloader () {
    this.preloaders = map(this.elements.preloaders, element => {
      return new AsyncLoad({ element })
    })
  }

  addEventListeners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners () {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent)
  }

  onMouseWheel (event) {
    const { pixelY } = NormalizeWheel(event)
    this.scroll.target += pixelY
  }

  onResize () {
    if (this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    }

    each(this.animations, animation => animation.onResize())
  }

  update () {
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[this.transfomPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  show () {
    return new Promise(resolve => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color')
      })
      this.animationIn = GSAP.timeline()
      this.animationIn.fromTo(this.element, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })

      this.animationIn.call(() => {
        this.addEventListeners()
        resolve()
      })
    })
  }

  hide () {
    return new Promise(resolve => {
      this.destroy()
      this.animationOut = GSAP.timeline()
      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  destroy () {
    this.removeEventListeners()
  }
}

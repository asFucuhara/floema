import { gsap } from 'gsap'
import Animation from '../classes/Animation'
import { calculate, split } from '../utils/text'

export default class Label extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    split({ element: this.element, append: true })
    split({ element: this.element, append: true })

    this.elementLinesSpans = this.element.querySelectorAll('span span')
  }

  animateIn () {
    gsap.set(this.element, {
      autoAlpha: 1
    })

    gsap.fromTo(this.elementLines, {
      autoAlpha: 0,
      y: '100%'
    }, {
      autoAlpha: 1,
      delay: 0.5,
      duration: 1.5,
      stagger: {
        axis: 'y',
        amount: 1
      },
      y: '0%'
    })
  }

  animateOut () {
    gsap.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {
    this.elementLines = calculate(this.elementLinesSpans)
  }
}

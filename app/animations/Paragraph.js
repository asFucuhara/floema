import { gsap } from 'gsap'
import Animation from '../classes/Animation'
import { calculate, split } from '../utils/text'

export default class Paragraph extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    split({ element: this.element, append: true })

    this.elementLinesSpans = this.element.querySelectorAll('span')
  }

  animateIn () {
    if (this.elementLines.length === 0) {
      return
    }

    gsap.set(this.element, {
      autoAlpha: 1
    })

    gsap.fromTo(this.elementLines, {
      autoAlpha: 0,
      y: '100%'
    }, {
      autoAlpha: 1,
      delay: 'random(0,1,1)',
      duration: 'random(0,1,1)',
      stagger: {
        amount: 1,
        from: 'start'
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

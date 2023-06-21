import { gsap } from 'gsap'
import Animation from '../classes/Animation'
import { calculate, split } from '../utils/text'

export default class Title extends Animation {
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
    if (this.isAnimatedIn) {
      return
    }
    this.animatedIn = true

    this.animateInTimelin = gsap.timeline()

    this.animateInTimelin.set(this.element, {
      autoAlpha: 1
    })

    this.animateInTimelin.fromTo(this.elementLines, {
      autoAlpha: 1,
      y: '100%'
    }, {
      autoAlpha: 1,
      delay: 0.5,
      duration: 1.5,
      ease: 'expo.out',
      stagger: {
        axis: 'x',
        amount: 1.2
      },
      y: '0%'
    }, 0)
  }

  animateOut () {
    this.animatedIn = false
    gsap.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {
    this.elementLines = calculate(this.elementLinesSpans)
  }
}

import { gsap } from 'gsap'
import Animation from '../classes/Animation'
import { calculate, split } from '../utils/text'

export default class Paragraph extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    this.elementLinesSpans = split({ element: this.element, append: true })
  }

  animateIn () {
    this.timelineIn = gsap.timeline({
      delay: 0.5
    })

    this.timelineIn.to(this.element, {
      autoAlpha: 1,
      duration: 1
    })

    // gsap.set(this.element, {
    //   autoAlpha: 1
    // })

    // gsap.fromTo(this.elementLines, {
    //   autoAlpha: 0,
    //   y: '100%'
    // }, {
    //   autoAlpha: 1,
    //   delay: 'random(0,1,1)',
    //   duration: 'random(0,1,1)',
    //   stagger: {
    //     amount: 1,
    //     from: 'start'
    //   },
    //   y: '0%'
    // })
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

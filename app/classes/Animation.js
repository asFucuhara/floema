import { gsap } from 'gsap'
import Component from './Component'

export default class Animation extends Component {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    this.createObserver()

    this.animateOut()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn()
        } else {
          this.animateOut()
        }
      })
    })
    this.observer.observe(this.element)
  }

  animateIn () {
    gsap.set(this.element, {
      autoAlpha: 1
    })
  }

  animateOut () {
    gsap.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {

  }
}

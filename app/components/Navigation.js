import { gsap } from 'gsap'
import Component from '../classes/Component'

import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from '../utils/colors'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        links: '.navigation__list__item',
        items: '.navigation__list__link'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
    const isAbout = template === 'about'
    gsap.to(this.element,
      {
        color: isAbout ? COLOR_BRIGHT_GRAY : COLOR_QUARTER_SPANISH_WHITE,
        duration: 1.5
      }
    )
    gsap.to(this.elements.items[0], {
      autoAlpha: isAbout ? 1 : 0,
      duration: 0.75,
      delay: isAbout ? 0.75 : 0
    })
    gsap.to(this.elements.items[1], {
      autoAlpha: isAbout ? 0 : 1,
      duration: 0.75,
      delay: isAbout ? 0 : 0.75
    })
  }
}

import { Mesh, Program } from 'ogl'

import fragment from '../../../shaders/collections-fragment.glsl'
import vertex from '../../../shaders/collections-vertex.glsl'

import { gsap } from 'gsap'

export default class Media {
  constructor ({ element, geometry, gl, scene, index, sizes }) {
    this.element = element
    this.geometry = geometry
    this.gl = gl
    this.scene = scene
    this.index = index
    this.sizes = sizes

    this.createTexture()
    this.createProgram()
    this.createMesh()

    this.extra = {
      x: 0, y: 0
    }

    this.opacity = { current: 0, target: 0, lerp: 0.1, multiplier: 0 }
  }

  createTexture () {
    const image = this.element.querySelector('img')

    this.texture = window.TEXTURES[image.getAttribute('data-src')]
  }

  createProgram () {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture },
        uAlpha: {
          value: 0
        }
      }
    })
  }

  createMesh () {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)

    // this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
  }

  createBounds ({ sizes }) {
    this.sizes = sizes
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale(sizes)
    this.updateX()
    this.updateY()
  }

  show () {
    gsap.fromTo(this.opacity, {
      multiplier: 0
    }, {
      multiplier: 1
    })
  }

  hide () {
    gsap.to(this.opacity, {
      multiplier: 0
    })
  }

  updateScale () {
    const { height, width } = this.sizes
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = width * this.width
    this.mesh.scale.y = height * this.height
  }

  updateX (x = 0) {
    const { width } = this.sizes

    this.x = (this.bounds.left + x) / window.innerWidth
    this.mesh.position.x = -(width / 2) + (this.mesh.scale.x / 2) + ((this.x) * width) + this.extra.x
  }

  updateY (y = 0) {
    const { height } = this.sizes

    this.y = (this.bounds.top + y) / window.innerHeight
    this.mesh.position.y = (height / 2) - (this.mesh.scale.y / 2) - ((this.y) * height) + this.extra.y
  }

  update (scroll, selected) {
    if (!this.bounds) return

    this.updateX(scroll)
    this.updateY()

    this.program.uniforms.uAlpha.value = this.opacity.multiplier
  }

  onResize (sizes, scroll) {
    this.extra = {
      x: 0, y: 0
    }
    this.createBounds(sizes)
    this.updateX(scroll.x)
    this.updateY(scroll.y)
  }

  destroy () {
    this.mesh.setParent(null)
  }
}

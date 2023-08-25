import { Mesh, Program, Plane } from 'ogl'

import fragment from '../../../shaders/plain-fragment.glsl'
import vertex from '../../../shaders/plain-vertex.glsl'

import { gsap } from 'gsap'

export default class Detail {
  constructor({ gl, scene, sizes, transition }) {
    this.id = 'detail'
    this.element = document.querySelector('.detail__media__image')
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.transition = transition

    this.geometry = new Plane(this.gl)

    this.createTexture()
    this.createProgram()
    this.createMesh()

    this.extra = {
      x: 0, y: 0
    }

    this.show()
  }

  createTexture() {
    this.texture = window.TEXTURES[this.element.getAttribute('data-src')]
  }

  createProgram() {
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

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)

    // this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
  }

  createBounds({ sizes }) {
    this.sizes = sizes
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale(sizes)
    this.updateX()
    this.updateY()
  }

  show() {
    if (this.transition) {
      this.transition.animate(this.mesh, () => {
        this.program.uniforms.uAlpha.value = 1
      })
    } else {
      gsap.to(this.program.uniforms.uAlpha, {
        value: 1
      })
    }
  }

  hide() {

  }

  updateScale() {
    const { height, width } = this.sizes
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = width * this.width
    this.mesh.scale.y = height * this.height
  }

  updateX() {
    const { width } = this.sizes

    this.x = (this.bounds.left) / window.innerWidth
    this.mesh.position.x = -(width / 2) + (this.mesh.scale.x / 2) + ((this.x) * width)
  }

  updateY() {
    const { height } = this.sizes

    this.y = (this.bounds.top) / window.innerHeight
    this.mesh.position.y = (height / 2) - (this.mesh.scale.y / 2) - ((this.y) * height)
  }

  update() {
    if (!this.bounds) return

    this.updateX()
    this.updateY()
  }

  onResize(sizes) {
    this.createBounds(sizes)
    this.updateX()
    this.updateY()
  }

  onTouchDown() { }

  onTouchMove() { }

  onTouchUp() { }

  destroy() {
    this.mesh.setParent(null)
  }
}

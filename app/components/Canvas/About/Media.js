import { Mesh, Program, Texture } from 'ogl'

import fragment from '../../../shaders/plain-fragment.glsl'
import vertex from '../../../shaders/plain-vertex.glsl'
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

    this.extra = 0
  }

  createTexture () {
    this.texture = new Texture(this.gl)

    const image = this.element.querySelector('img')

    // eslint-disable-next-line no-undef
    this.image = new Image()
    this.image.crossOrigin = 'anonymous'
    this.image.src = image.getAttribute('data-src')

    this.image.onload = () => {
      this.texture.image = this.image
    }
  }

  createProgram () {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture },
        uAlpha: { value: 0 }
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

    this.updateScale()
    this.updateX()
    // this.updateY()
  }

  show () {
    gsap.fromTo(this.program.uniforms.uAlpha, {
      value: 0
    }, {
      value: 1
    })
  }

  hide () {
    gsap.to(this.program.uniforms.uAlpha, {
      value: 0
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
    this.mesh.position.x = -(width / 2) + (this.mesh.scale.x / 2) + ((this.x) * width) + this.extra
  }

  updateY (y = 0) {
    const { height } = this.sizes

    this.y = (this.bounds.top + y) / window.innerHeight
    this.mesh.position.y = (height / 2) - (this.mesh.scale.y / 2) - ((this.y) * height)
  }

  update (scroll) {
    if (!this.bounds) return

    this.updateX(scroll)
    this.updateY(0)
  }

  onResize (sizes, scroll) {
    this.extra = 0

    this.createBounds(sizes)

    this.updateX(scroll)
    this.updateY(0)
  }
}

import { Mesh, Program } from 'ogl'

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
    const image = this.element.querySelector('img')

    this.texture = window.TEXTURES[image.getAttribute('data-src')]
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
      delay: 0.5,
      value: 1,
    })
  }

  hide () {
    gsap.to(this.program.uniforms.uAlpha, {
      value: 0
    })
  }

  onResize (sizes, scroll, width) {
    this.extra = 0
    this.widthTotal = width

    this.createBounds(sizes)
    this.updateX(scroll)
    this.updateY(0)
  }

  updateRotation () {
    this.mesh.rotation.z = gsap.utils.mapRange(
      -this.sizes.width / 2,
      this.sizes.width / 2,
      Math.PI * 0.1,
      -Math.PI * 0.1,
      this.mesh.position.x)
  }

  updateScale () {
    const { height, width } = this.sizes
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = width * this.width
    this.mesh.scale.y = height * this.height

    // const scale = gsap.utils.mapRange(
    //   0,
    //   this.sizes.width / 2,
    //   0.1,
    //   0,
    //   Math.abs(this.mesh.position.x)
    // )

    // this.mesh.scale.x += scale
    // this.mesh.scale.y += scale
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
    this.mesh.position.y += Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 - 40
  }

  update (scroll) {
    if (!this.bounds) return

    this.updateRotation()
    this.updateScale()
    this.updateX(scroll)
    this.updateY(0)
  }
}

import { Mesh, Program, Texture } from 'ogl'

import fragment from '../../shaders/plain-fragment.glsl'
import vertex from '../../shaders/plain-vertex.glsl'

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
  }

  createTexture () {
    this.texture = new Texture(this.gl)

    // eslint-disable-next-line no-undef
    this.image = new Image()
    this.image.crossOrigin = 'anonymous'
    this.image.src = this.element.getAttribute('data-src')

    this.image.onload = () => {
      this.texture.image = this.image
    }
  }

  createProgram () {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture }
      }
    })
  }

  createMesh () {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)

    this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
  }

  createBounds ({ sizes }) {
    this.sizes = sizes
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale(sizes)
    this.updateX()
    this.updateY()
  }

  updateScale () {
    const { height, width } = this.sizes
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = width * this.width
    this.mesh.scale.y = height * this.height

    // console.log(this.width, this.height)
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

  update (scroll) {
    if (!this.bounds) return

    this.updateX(scroll.x)
    this.updateY(scroll.y)
  }

  onResize (sizes, scroll) {
    this.extra = {
      x: 0, y: 0
    }
    this.createBounds(sizes)
    this.updateX(scroll.x)
    this.updateY(scroll.y)
  }
}

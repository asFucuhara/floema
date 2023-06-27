import { Mesh, Program, Texture } from 'ogl'

import fragment from '../../shaders/plain-fragment.glsl'
import vertex from '../../shaders/plain-vertex.glsl'
import { windows } from 'normalize-wheel/src/UserAgent_DEPRECATED'

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

    // this.mesh.position.x += this.index * this.mesh.scale.x
    this.mesh.position.x = 2
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
    this.mesh.position.x = -(width / 2) + (this.mesh.scale.x / 2) + ((this.x) * width)
  }

  updateY (y = 0) {
    const { height } = this.sizes

    this.y = (this.bounds.top + y) / window.innerHeight
    this.mesh.position.y = (height / 2) - (this.mesh.scale.y / 2) - ((this.y) * height)
  }

  update (scroll) {
    if (!this.bounds) return

    this.updateX(scroll.x)
    this.updateY(scroll.y)
  }

  onResize (sizes) {
    this.createBounds(sizes)
  }
}
